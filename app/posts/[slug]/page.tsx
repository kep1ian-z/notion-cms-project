import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CategoryBadge } from "@/components/category-badge";
import { NotionBlocks } from "@/components/notion-blocks";
import { TagList } from "@/components/tag-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchPostBlocks, fetchPostBySlug } from "@/lib/notion";
import { decodeParam, formatDate } from "@/lib/post-utils";

// 브라우저 탭/공유 시 글 제목을 쓰기 위한 메타데이터 (fetchPublishedPosts는 요청 내 캐시됨)
export async function generateMetadata({
    params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const post = await fetchPostBySlug(decodeParam(slug));
    return { title: post ? `${post.title} | 개발 블로그` : "글을 찾을 수 없습니다" };
}

// 글 상세 페이지: Notion 본문 블록을 렌더링한다. 없는/초안 글은 404 처리한다
export default async function PostPage({
    params,
}: PageProps<"/posts/[slug]">) {
    const { slug } = await params;
    const decodedSlug = decodeParam(slug);

    const post = await fetchPostBySlug(decodedSlug);
    if (!post) {
        notFound();
    }

    // 제목이 바뀌어 옛 slug로 들어온 경우 현재 slug로 이동시킨다
    if (decodedSlug !== post.slug) {
        redirect(`/posts/${encodeURIComponent(post.slug)}`);
    }

    const blocks = await fetchPostBlocks(post.id);

    return (
        <article className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 sm:py-16">
            <Button
                variant="ghost"
                size="sm"
                className="-ml-2 w-fit"
                nativeButton={false}
                render={<Link href="/" />}
            >
                <ArrowLeft />
                목록으로
            </Button>

            <header className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <CategoryBadge category={post.category} linked />
                    <time
                        dateTime={post.publishedAt}
                        className="text-sm text-muted-foreground"
                    >
                        {formatDate(post.publishedAt)}
                    </time>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    {post.title}
                </h1>
                <TagList tags={post.tags} />
            </header>

            <Separator />

            <div className="text-base leading-8">
                {blocks.length > 0 ? (
                    <NotionBlocks blocks={blocks} />
                ) : (
                    <p className="text-muted-foreground">
                        아직 작성된 본문이 없습니다.
                    </p>
                )}
            </div>
        </article>
    );
}
