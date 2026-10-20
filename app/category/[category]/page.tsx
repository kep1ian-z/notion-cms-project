import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryFilter } from "@/components/category-filter";
import { PostList } from "@/components/post-list";
import { fetchPostsByCategory, fetchPublishedPosts } from "@/lib/notion";
import { decodeParam, getCategories } from "@/lib/post-utils";

// URL의 카테고리를 Notion에 실제 있는 카테고리명으로 맞춘다 (대소문자 무시). 없으면 undefined
async function resolveCategory(rawCategory: string) {
    const categories = getCategories(await fetchPublishedPosts());
    const target = decodeParam(rawCategory).toLowerCase();
    return {
        categories,
        category: categories.find((item) => item.toLowerCase() === target),
    };
}

export async function generateMetadata({
    params,
}: PageProps<"/category/[category]">): Promise<Metadata> {
    const { category } = await resolveCategory((await params).category);
    return { title: category ? `${category} | 개발 블로그` : "카테고리를 찾을 수 없습니다" };
}

// 카테고리 페이지: Notion에서 해당 카테고리의 발행된 글만 서버사이드로 조회한다
export default async function CategoryPage({
    params,
}: PageProps<"/category/[category]">) {
    const { categories, category } = await resolveCategory(
        (await params).category,
    );
    if (!category) {
        notFound();
    }

    const posts = await fetchPostsByCategory(category);

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
