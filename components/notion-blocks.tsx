import type { RichTextItemResponse } from "@notionhq/client";
import type { ReactNode } from "react";

import type { NotionBlock } from "@/lib/types";

// Notion 서식(굵게/기울임/코드/링크 등)이 적용된 텍스트를 렌더링한다
function RichText({ items }: { items: RichTextItemResponse[] }) {
    return (
        <>
            {items.map((item, index) => {
                const { bold, italic, strikethrough, underline, code } =
                    item.annotations;
                let node: ReactNode = item.plain_text;

                if (code) {
                    node = (
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
                            {node}
                        </code>
                    );
                }
                if (bold) node = <strong>{node}</strong>;
                if (italic) node = <em>{node}</em>;
                if (strikethrough) node = <s>{node}</s>;
                if (underline) node = <u>{node}</u>;
                if (item.href) {
                    node = (
                        <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            {node}
                        </a>
                    );
                }
                return <span key={index}>{node}</span>;
            })}
        </>
    );
}

// 하위 블록이 있으면 들여쓰기해서 렌더링한다
function Children({ blocks }: { blocks?: NotionBlock[] }) {
    if (!blocks || blocks.length === 0) {
        return null;
    }
    return (
        <div className="mt-2 pl-6">
            <NotionBlocks blocks={blocks} />
        </div>
    );
}

// 블록 하나를 렌더링한다. 리스트 항목은 NotionBlocks에서 묶어서 처리한다
function Block({ block }: { block: NotionBlock }) {
    switch (block.type) {
        case "paragraph":
            // 빈 문단은 Notion에서 줄 간격용이라 건너뛴다
            if (block.paragraph.rich_text.length === 0) {
                return null;
            }
            return (
                <div>
                    <p className="whitespace-pre-wrap">
                        <RichText items={block.paragraph.rich_text} />
                    </p>
                    <Children blocks={block.children} />
                </div>
            );
        // 페이지 제목이 h1이므로 본문 제목은 h2부터 시작한다
        case "heading_1":
            return (
                <h2 className="mt-8 text-2xl font-bold tracking-tight">
                    <RichText items={block.heading_1.rich_text} />
                </h2>
            );
        case "heading_2":
            return (
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                    <RichText items={block.heading_2.rich_text} />
                </h3>
            );
        case "heading_3":
            return (
                <h4 className="mt-4 text-lg font-semibold">
                    <RichText items={block.heading_3.rich_text} />
                </h4>
            );
        case "quote":
            return (
                <blockquote className="border-l-4 pl-4 text-muted-foreground">
                    <RichText items={block.quote.rich_text} />
                    <Children blocks={block.children} />
                </blockquote>
            );
        case "callout":
            return (
                <div className="flex gap-3 rounded-lg bg-muted p-4">
                    {block.callout.icon?.type === "emoji" && (
                        <span aria-hidden>{block.callout.icon.emoji}</span>
                    )}
                    <div className="min-w-0 flex-1">
                        <RichText items={block.callout.rich_text} />
                        <Children blocks={block.children} />
                    </div>
                </div>
            );
        case "code":
            return (
                <figure className="overflow-hidden rounded-lg border bg-muted/50">
                    <div className="border-b px-4 py-1.5 font-mono text-xs text-muted-foreground">
                        {block.code.language}
                    </div>
                    <pre className="overflow-x-auto p-4 text-sm leading-6">
                        <code>
                            {block.code.rich_text
                                .map((text) => text.plain_text)
                                .join("")}
                        </code>
                    </pre>
                </figure>
            );
        case "to_do":
            return (
                <div>
                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={block.to_do.checked}
                            readOnly
                            disabled
                            className="mt-2.5"
                        />
                        <span className={block.to_do.checked ? "text-muted-foreground line-through" : ""}>
                            <RichText items={block.to_do.rich_text} />
                        </span>
                    </label>
                    <Children blocks={block.children} />
                </div>
            );
        case "toggle":
            return (
                <details className="rounded-lg border px-4 py-2">
                    <summary className="cursor-pointer font-medium">
                        <RichText items={block.toggle.rich_text} />
                    </summary>
                    <Children blocks={block.children} />
                </details>
            );
        case "divider":
            return <hr className="my-2" />;
        case "image": {
            const src =
                block.image.type === "external"
                    ? block.image.external.url
                    : block.image.file.url;
            const caption = block.image.caption
                .map((text) => text.plain_text)
                .join("");
            return (
                <figure className="flex flex-col gap-2">
                    {/* Notion 이미지 URL은 만료되므로 최적화(next/image)는 Task 012에서 다룬다 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={caption}
                        loading="lazy"
                        className="h-auto max-w-full rounded-lg"
                    />
                    {caption && (
                        <figcaption className="text-center text-sm text-muted-foreground">
                            {caption}
                        </figcaption>
                    )}
                </figure>
            );
        }
        case "bookmark":
        case "embed":
        case "link_preview": {
            const url =
                block.type === "bookmark"
                    ? block.bookmark.url
                    : block.type === "embed"
                      ? block.embed.url
                      : block.link_preview.url;
            return (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate rounded-lg border px-4 py-3 text-sm underline-offset-4 hover:bg-muted"
                >
                    {url}
                </a>
            );
        }
        case "table":
            return (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            {block.children?.map((row, rowIndex) => {
                                if (row.type !== "table_row") return null;
                                const isHeader =
                                    block.table.has_column_header && rowIndex === 0;
                                const Cell = isHeader ? "th" : "td";
                                return (
                                    <tr key={row.id}>
                                        {row.table_row.cells.map((cell, cellIndex) => (
                                            <Cell
                                                key={cellIndex}
                                                className={`border px-3 py-2 text-left ${isHeader ? "bg-muted font-semibold" : ""}`}
                                            >
                                                <RichText items={cell} />
                                            </Cell>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        default:
            // 아직 지원하지 않는 블록(영상, 파일, 수식 등)은 건너뛴다
            return null;
    }
}

// 같은 종류의 연속된 리스트 항목을 하나의 ul/ol로 묶어 렌더링한다
export function NotionBlocks({ blocks }: { blocks: NotionBlock[] }) {
    const elements: ReactNode[] = [];

    for (let index = 0; index < blocks.length; index++) {
        const block = blocks[index];

        if (
            block.type === "bulleted_list_item" ||
            block.type === "numbered_list_item"
        ) {
            const listType = block.type;
            const items: NotionBlock[] = [];
            while (index < blocks.length && blocks[index].type === listType) {
                items.push(blocks[index]);
                index++;
            }
            index--;

            const ListTag = listType === "bulleted_list_item" ? "ul" : "ol";
            elements.push(
                <ListTag
                    key={block.id}
                    className={`flex flex-col gap-1 pl-6 ${listType === "bulleted_list_item" ? "list-disc" : "list-decimal"}`}
                >
                    {items.map((item) => (
                        <li key={item.id}>
                            {item.type === "bulleted_list_item" && (
                                <RichText items={item.bulleted_list_item.rich_text} />
                            )}
                            {item.type === "numbered_list_item" && (
                                <RichText items={item.numbered_list_item.rich_text} />
                            )}
                            <Children blocks={item.children} />
                        </li>
                    ))}
                </ListTag>,
            );
            continue;
        }

        elements.push(<Block key={block.id} block={block} />);
    }

    return <div className="flex flex-col gap-4">{elements}</div>;
}
