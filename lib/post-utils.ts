// 글 데이터를 가공하는 순수 유틸 함수 모음 (날짜 포맷, slug 생성, 필터링)
import type { Category, Post, Tag } from "./types";

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

/** URL 파라미터를 디코딩한다. 잘못된 인코딩이면 원본을 그대로 반환한다. */
export function decodeParam(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}
