// 카테고리 페이지 placeholder (Task 009에서 실제 카테고리 필터링으로 교체)
export default async function CategoryPage({
    params,
}: PageProps<"/category/[category]">) {
    const { category } = await params;

    return (
        <div className="mx-auto max-w-5xl px-4 py-16">
            <h1 className="text-3xl font-bold tracking-tight">카테고리</h1>
            <p className="mt-4 text-muted-foreground">
                category: <span className="font-mono">{decodeURIComponent(category)}</span>
            </p>
        </div>
    );
}
