// Notion 클라이언트 초기화와 글 조회 함수. 페이지/컴포넌트는 이 파일의 export만 사용한다.
import "server-only";

import { Client, collectPaginatedAPI, isFullBlock, isFullPage } from "@notionhq/client";
import { cache } from "react";
import type { PageObjectResponse } from "@notionhq/client";

import { buildPostSlug, getIdSuffix, parsePostSlugSuffix } from "@/lib/post-utils";
import type { NotionBlock, Post, Status } from "@/lib/types";

// 웹사이트에 노출하는 유일한 상태값
const PUBLISHED_STATUS: Status = "발행됨";

// Notion 요청 1건당 최대 대기 시간
const NOTION_TIMEOUT_MS = 15_000;

let notionClient: Client | null = null;
let dataSourceId: string | null = null;

/** 환경 변수를 읽어 Notion 클라이언트를 한 번만 생성한다. */
function getClient(): Client {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
        throw new Error("NOTION_API_KEY 환경 변수가 설정되지 않았습니다.");
    }
    // 응답이 없을 때 페이지가 오래 매달리지 않도록 요청당 타임아웃을 짧게 둔다 (SDK 기본 60초)
    notionClient ??= new Client({ auth: apiKey, timeoutMs: NOTION_TIMEOUT_MS });
    return notionClient;
}

/** v5 API는 database 아래의 data source를 조회하므로 ID를 찾아 캐시한다. */
async function getDataSourceId(): Promise<string> {
    if (dataSourceId) {
        return dataSourceId;
    }

    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
        throw new Error("NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.");
    }

    const database = await getClient().databases.retrieve({
        database_id: databaseId,
    });
    const firstDataSource =
        "data_sources" in database ? database.data_sources[0] : undefined;
    if (!firstDataSource) {
        throw new Error("Notion 데이터베이스에서 data source를 찾지 못했습니다.");
    }

    dataSourceId = firstDataSource.id;
    return dataSourceId;
}

/** Notion 페이지 한 건을 Post 타입으로 변환한다. (필드 매핑은 lib/types.ts 참고) */
function pageToPost(page: PageObjectResponse): Post {
    const { Title, Category, Tags, Published, Status } = page.properties;

    const title =
        Title?.type === "title"
            ? Title.title.map((text) => text.plain_text).join("")
            : "";

    return {
        id: page.id,
        // slug는 Notion 필드가 아니라 제목 + 페이지 ID 뒤 8자리로 생성한다 (제목이 같아도 겹치지 않음)
        slug: buildPostSlug(title, page.id),
        title: title || "제목 없음",
        category:
            Category?.type === "select" && Category.select
                ? Category.select.name
                : "미분류",
        tags:
            Tags?.type === "multi_select"
                ? Tags.multi_select.map((tag) => tag.name)
                : [],
        // 발행일이 비어 있으면 페이지 생성일로 대체한다
        publishedAt:
            (Published?.type === "date" ? Published.date?.start : undefined) ??
            page.created_time,
        status:
            Status?.type === "select" && Status.select?.name === PUBLISHED_STATUS
                ? PUBLISHED_STATUS
                : "초안",
    };
}

/**
 * 발행된 글을 발행일 최신순으로 모두 가져온다.
 * 모든 조회가 이 함수를 거치므로 Status = 발행됨 필터가 항상 포함된다. category를 주면 서버사이드로 함께 필터링한다.
 */
async function queryPublishedPosts(category?: string): Promise<Post[]> {
    const notion = getClient();
    const dataSource = await getDataSourceId();

    const statusFilter = {
        property: "Status",
        select: { equals: PUBLISHED_STATUS },
    };

    const posts: Post[] = [];
    let cursor: string | undefined;

    do {
        const response = await notion.dataSources.query({
            data_source_id: dataSource,
            filter: category
                ? {
                      and: [
                          statusFilter,
                          { property: "Category", select: { equals: category } },
                      ],
                  }
                : statusFilter,
            sorts: [{ property: "Published", direction: "descending" }],
            start_cursor: cursor,
            page_size: 100,
        });

        for (const page of response.results) {
            if (isFullPage(page)) {
                posts.push(pageToPost(page));
            }
        }
        cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return posts;
}

/** Status = 발행됨 인 글 전체를 최신순으로 가져온다. (한 요청 안에서는 결과를 재사용한다) */
export const fetchPublishedPosts = cache(() => queryPublishedPosts());

/** 카테고리명이 정확히 일치하는 발행된 글을 최신순으로 가져온다. */
export const fetchPostsByCategory = cache((category: string) =>
    queryPublishedPosts(category),
);

/**
 * slug로 발행된 글 한 건을 찾는다. slug 끝의 페이지 ID 식별자로만 매칭하므로
 * 제목이 바뀐 뒤 옛 slug로 접근해도 같은 글을 찾는다. 없거나 초안이면 null.
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
    const suffix = parsePostSlugSuffix(slug);
    if (!suffix) {
        return null;
    }

    const posts = await fetchPublishedPosts();
    return posts.find((post) => getIdSuffix(post.id) === suffix) ?? null;
}

/** 블록 하나의 하위 블록을 재귀적으로 가져온다. */
async function fetchBlockChildren(blockId: string): Promise<NotionBlock[]> {
    const results = await collectPaginatedAPI(getClient().blocks.children.list, {
        block_id: blockId,
    });
    const blocks: NotionBlock[] = results.filter(isFullBlock);

    // 하위 페이지/데이터베이스는 본문이 아니므로 따라 들어가지 않는다
    await Promise.all(
        blocks.map(async (block) => {
            if (
                block.has_children &&
                block.type !== "child_page" &&
                block.type !== "child_database"
            ) {
                block.children = await fetchBlockChildren(block.id);
            }
        }),
    );
    return blocks;
}

/** 글(페이지)의 본문 블록 전체를 가져온다. */
export async function fetchPostBlocks(pageId: string): Promise<NotionBlock[]> {
    return fetchBlockChildren(pageId);
}
