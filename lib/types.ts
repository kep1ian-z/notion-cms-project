// Notion 데이터베이스(docs/PRD.md 5번 표)와 매핑되는 타입 정의 모음.
// 이후 lib/notion.ts에서 Notion API 응답을 이 타입으로 변환해 사용한다.

/**
 * Status 속성(상태) 값.
 * Notion select 옵션: 초안 / 발행됨
 * 웹사이트에는 "발행됨" 상태의 글만 노출해야 한다 (shrimp-rules.md 참고).
 */
export type Status = "초안" | "발행됨";

/**
 * Category 속성(카테고리) 값.
 * Notion select 타입이며, 워크스페이스에서 자유롭게 추가되는 값이라
 * 고정 리터럴 대신 string으로 둔다.
 */
export type Category = string;

/**
 * Tags 속성(태그) 값.
 * Notion multi_select 타입이며, 글 하나에 여러 개가 붙을 수 있다.
 */
export type Tag = string;

/**
 * 블로그 글 한 건을 나타내는 타입.
 * Notion 필드명 ↔ 타입 필드 매핑:
 * - Title(제목, title)      -> title
 * - Category(카테고리, select) -> category
 * - Tags(태그, multi_select)  -> tags
 * - Published(발행일, date)   -> publishedAt
 * - Status(상태, select)     -> status
 * - Content(본문, page content) -> content
 */
export interface Post {
    // Notion 페이지 고유 ID
    id: string;
    // URL(/posts/[slug])에 사용할 식별자. Notion 필드가 아니라 title로부터 생성한다.
    slug: string;
    title: string;
    category: Category;
    tags: Tag[];
    // ISO 8601 날짜 문자열 (예: "2026-01-01")
    publishedAt: string;
    status: Status;
    // 글 목록 카드 등에서 쓰는 짧은 요약. Notion 본문 첫 부분을 가공해 채운다.
    excerpt?: string;
    // Notion 페이지 본문(블록 콘텐츠). 상세 페이지 렌더링 단계(Task 008)에서 구체화한다.
    content?: string;
}
