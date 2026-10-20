import { PostCard } from "@/components/post-card";
import type { Post } from "@/lib/types";

interface PostListProps {
    posts: Post[];
    emptyMessage?: string;
}

// 글 카드 그리드. 모바일 1열, sm 이상 2열, lg 이상 3열
export function PostList({
    posts,
    emptyMessage = "표시할 글이 없습니다.",
}: PostListProps) {
    if (posts.length === 0) {
        return (
            <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
                {emptyMessage}
            </p>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
