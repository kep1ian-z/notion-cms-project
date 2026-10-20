import Link from "next/link";

import { CategoryBadge } from "@/components/category-badge";
import { TagList } from "@/components/tag-list";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Post } from "@/lib/types";

interface PostCardProps {
    post: Post;
}

// 글 목록에서 글 한 건을 카드로 보여준다 (카드 전체가 상세 페이지 링크)
export function PostCard({ post }: PostCardProps) {
    const publishedDate = new Date(post.publishedAt).toLocaleDateString(
        "ko-KR",
        { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
    );

    return (
        <Card className="relative h-full transition-shadow hover:ring-foreground/25">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CategoryBadge category={post.category} />
                    <time
                        dateTime={post.publishedAt}
                        className="text-xs text-muted-foreground"
                    >
                        {publishedDate}
                    </time>
                </div>
                <CardTitle className="text-lg">
                    <Link
                        href={`/posts/${post.slug}`}
                        className="after:absolute after:inset-0 after:content-['']"
                    >
                        {post.title}
                    </Link>
                </CardTitle>
                {post.excerpt && (
                    <CardDescription className="line-clamp-2">
                        {post.excerpt}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="mt-auto">
                <TagList tags={post.tags} />
            </CardContent>
        </Card>
    );
}
