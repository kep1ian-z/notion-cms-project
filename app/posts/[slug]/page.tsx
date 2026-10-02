// 글 상세 페이지 placeholder (Task 008에서 실제 Notion 본문 렌더링으로 교체)
export default async function PostPage({
    params,
}: PageProps<"/posts/[slug]">) {
    const { slug } = await params;

    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold tracking-tight">글 상세</h1>
            <p className="mt-4 text-muted-foreground">
                slug: <span className="font-mono">{slug}</span>
            </p>
        </div>
    );
}
