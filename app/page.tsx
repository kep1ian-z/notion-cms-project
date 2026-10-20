import { CategoryFilter } from "@/components/category-filter";
import { PostList } from "@/components/post-list";
import { SearchBar } from "@/components/search-bar";
import { fetchPublishedPosts } from "@/lib/notion";
import { getCategories, searchPosts } from "@/lib/post-utils";

// 홈: Notion에서 가져온 발행된 글 목록 (최신순)
export default async function Home({ searchParams }: PageProps<"/">) {
    const { q } = await searchParams;
    const keyword = typeof q === "string" ? q : "";

    const publishedPosts = await fetchPublishedPosts();
    const posts = searchPosts(publishedPosts, keyword);

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:py-16">
            <section className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    개발 블로그
                </h1>
                <p className="text-muted-foreground">
                    Notion에 쓴 글이 그대로 블로그가 됩니다.
                </p>
            </section>

            <section className="flex flex-col gap-4">
                <SearchBar defaultValue={keyword} />
                <CategoryFilter categories={getCategories(publishedPosts)} />
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">
                    {keyword ? `"${keyword}" 검색 결과` : "최근 글"}
                </h2>
                <PostList
                    posts={posts}
                    emptyMessage={
                        keyword
                            ? "검색 결과가 없습니다."
                            : "아직 발행된 글이 없습니다."
                    }
                />
            </section>
        </div>
    );
}
