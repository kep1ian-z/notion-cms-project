import { notFound } from "next/navigation";

import { CategoryFilter } from "@/components/category-filter";
import { PostList } from "@/components/post-list";
import { dummyPosts } from "@/lib/dummy-data";
import {
    decodeParam,
    filterByCategory,
    getCategories,
    getPublishedPosts,
} from "@/lib/post-utils";

// 카테고리 페이지: 선택한 카테고리의 글 목록 (Task 009에서 Notion 서버사이드 필터로 교체)
export default async function CategoryPage({
    params,
}: PageProps<"/category/[category]">) {
    const { category: rawCategory } = await params;
    const publishedPosts = getPublishedPosts(dummyPosts);
    const categories = getCategories(publishedPosts);

    // 대소문자만 다른 URL도 실제 카테고리명으로 맞춘다
    const category = categories.find(
        (item) => item.toLowerCase() === decodeParam(rawCategory).toLowerCase(),
    );
    if (!category) {
        notFound();
    }

    const posts = filterByCategory(publishedPosts, category);

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:py-16">
            <section className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">카테고리</p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {category}
                </h1>
                <p className="text-muted-foreground">글 {posts.length}개</p>
            </section>

            <CategoryFilter categories={categories} activeCategory={category} />

            <PostList posts={posts} />
        </div>
    );
}
