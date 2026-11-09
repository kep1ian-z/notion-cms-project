// 글 데이터를 가공하는 순수 유틸 함수 모음 (날짜 포맷, slug 생성, 필터링)
import type { Category, NotionBlock, Post, PostHeading, Tag } from "./types";

/** ISO 날짜 문자열을 "2026년 9월 21일" 형태로 변환한다. 서버/클라이언트 결과가 같도록 UTC 기준으로 계산한다. */
export function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

/** 제목으로 URL slug를 만든다. 영문 소문자/숫자/한글만 남기고 나머지는 하이픈으로 바꾼다. */
export function generateSlug(title: string): string {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** 발행됨 상태의 글만 남기고 최신 발행일 순으로 정렬한다. */
export function getPublishedPosts(posts: Post[]): Post[] {
    return posts
        .filter((post) => post.status === "발행됨")
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** 카테고리가 일치하는 글만 반환한다. 대소문자는 구분하지 않는다. */
export function filterByCategory(posts: Post[], category: Category): Post[] {
    const target = category.toLowerCase();
    return posts.filter((post) => post.category.toLowerCase() === target);
}

/** 태그가 포함된 글만 반환한다. 대소문자는 구분하지 않는다. */
export function filterByTag(posts: Post[], tag: Tag): Post[] {
    const target = tag.toLowerCase();
    return posts.filter((post) =>
        post.tags.some((postTag) => postTag.toLowerCase() === target),
    );
}

/** 제목 또는 태그에 검색어가 포함된 글만 반환한다. 검색어가 비어 있으면 전체를 반환한다. */
export function searchPosts(posts: Post[], keyword: string): Post[] {
    const target = keyword.trim().toLowerCase();
    if (target === "") {
        return posts;
    }
    return posts.filter(
        (post) =>
            post.title.toLowerCase().includes(target) ||
            post.tags.some((tag) => tag.toLowerCase().includes(target)),
    );
}

/** 글 목록에서 중복 없는 카테고리 목록을 가나다/알파벳 순으로 반환한다. */
export function getCategories(posts: Post[]): Category[] {
    return [...new Set(posts.map((post) => post.category))].sort();
}

/** 글 목록에서 중복 없는 태그 목록을 가나다/알파벳 순으로 반환한다. */
export function getTags(posts: Post[]): Tag[] {
    return [...new Set(posts.flatMap((post) => post.tags))].sort();
}

// 목록 한 페이지에 보여줄 글 수 (3열 그리드 기준 3줄)
export const POSTS_PER_PAGE = 9;

/** ?page= 값을 1 이상의 정수로 바꾼다. 비정상 값이면 1을 반환한다. */
export function parsePage(value: string | string[] | undefined): number {
    const page = Number(typeof value === "string" ? value : "");
    return Number.isInteger(page) && page >= 1 ? page : 1;
}

/** 목록을 페이지 단위로 자른다. 범위를 벗어난 페이지는 마지막 페이지로 보정한다. */
export function paginate<T>(
    items: T[],
    page: number,
    perPage: number = POSTS_PER_PAGE,
): { items: T[]; currentPage: number; totalPages: number } {
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * perPage;
    return { items: items.slice(start, start + perPage), currentPage, totalPages };
}

/** 본문 블록에서 목차에 쓸 제목(heading_1~3)을 순서대로 뽑는다. 비어 있는 제목은 제외한다. */
export function getHeadings(blocks: NotionBlock[]): PostHeading[] {
    const headings: PostHeading[] = [];
    for (const block of blocks) {
        const richText =
            block.type === "heading_1"
                ? block.heading_1.rich_text
                : block.type === "heading_2"
                  ? block.heading_2.rich_text
                  : block.type === "heading_3"
                    ? block.heading_3.rich_text
                    : null;
        if (!richText) continue;

        const text = richText.map((item) => item.plain_text).join("").trim();
        if (text) {
            headings.push({
                id: block.id,
                text,
                level: Number(block.type.slice(-1)) as 1 | 2 | 3,
            });
        }
    }
    return headings;
}

/** URL 파라미터를 디코딩한다. 잘못된 인코딩이면 원본을 그대로 반환한다. */
export function decodeParam(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

/** Notion 페이지 ID(하이픈 유무 무관)의 뒤 8자리를 slug 식별자로 쓴다. 앞자리는 생성 시각 기반이라 글끼리 같을 수 있다. */
export function getIdSuffix(pageId: string): string {
    return pageId.replace(/-/g, "").slice(-8).toLowerCase();
}

/** 제목 slug 뒤에 페이지 ID 식별자를 붙여 제목이 같은 글끼리도 겹치지 않는 slug를 만든다. */
export function buildPostSlug(title: string, pageId: string): string {
    const base = generateSlug(title);
    const suffix = getIdSuffix(pageId);
    return base ? `${base}-${suffix}` : suffix;
}

/** slug 끝의 8자리 식별자를 꺼낸다. 형식이 맞지 않으면 null을 반환한다. */
export function parsePostSlugSuffix(slug: string): string | null {
    const match = slug.match(/(?:^|-)([0-9a-f]{8})$/);
    return match ? match[1] : null;
}
