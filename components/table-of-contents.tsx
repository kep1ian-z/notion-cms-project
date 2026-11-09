import type { PostHeading } from "@/lib/types";

interface TableOfContentsProps {
    headings: PostHeading[];
}

// 글 본문 제목으로 이동하는 목차. 접어둘 수 있어 모바일에서도 본문을 가리지 않는다
export function TableOfContents({ headings }: TableOfContentsProps) {
    return (
        <nav aria-label="목차" className="rounded-lg border bg-muted/30 px-4 py-3">
            <details open>
                <summary className="cursor-pointer text-sm font-semibold">
                    목차
                </summary>
                <ol className="mt-2 flex flex-col gap-1 text-sm">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                        >
                            <a
                                href={`#${heading.id}`}
                                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ol>
            </details>
        </nav>
    );
}
