import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryBadge } from "@/components/category-badge";
import { TagList } from "@/components/tag-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dummyPosts } from "@/lib/dummy-data";
import { decodeParam, formatDate, getPublishedPosts } from "@/lib/post-utils";

// 글 상세 페이지 (Task 008에서 Notion 블록 렌더링으로 교체). 없는 slug는 404 처리한다
export default async function PostPage({
    params,
}: PageProps<"/posts/[slug]">) {
    const { slug } = await params;
    const post = getPublishedPosts(dummyPosts).find(
        (item) => item.slug === decodeParam(slug),
    );
    if (!post) {
        notFound();
    }

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

            <div className="flex flex-col gap-4 text-base leading-8">
                <p>{post.content ?? post.excerpt}</p>
            </div>
        </article>
    );
}
