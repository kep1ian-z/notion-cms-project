# 스타일 가이드

블로그 UI는 Tailwind CSS v4 + shadcn/ui(`base-nova`, `@base-ui/react` 기반)로 구성한다. 컴포넌트 확인은 `/demo` 페이지에서 한다.

## 디자인 토큰

- 색상/반경 등은 `app/globals.css`의 CSS 변수(`--background`, `--primary`, `--muted-foreground` 등)를 사용한다. 색상 값을 직접 쓰지 않고 `bg-background`, `text-muted-foreground` 같은 시맨틱 클래스를 쓴다.
- 다크 모드는 `next-themes`가 처리하므로 컴포넌트에서 `dark:` 분기를 따로 만들지 않는다.

## 레이아웃

- 페이지 컨테이너: `mx-auto max-w-5xl px-4` (Header/Footer와 동일)
- 글 목록: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` (모바일 1열, sm 2열, lg 3열)
- 섹션 간격: `gap-16`, 섹션 내부: `gap-4`

## 블로그 컴포넌트

| 컴포넌트 | 파일 | 용도 |
|---|---|---|
| `PostCard` | `components/post-card.tsx` | 글 목록의 카드. 카드 전체가 `/posts/[slug]` 링크 |
| `CategoryBadge` | `components/category-badge.tsx` | 카테고리 뱃지. `linked`이면 `/category/[category]` 링크 |
| `TagList` | `components/tag-list.tsx` | 태그 목록(outline 뱃지). 태그가 없으면 렌더링하지 않음 |
| `SearchBar` | `components/search-bar.tsx` | 검색 입력. GET 폼이라 제출 시 `?q=`로 이동 (홈에서 제목/태그 필터링) |
| `CategoryFilter` | `components/category-filter.tsx` | "전체" + 카테고리 이동 버튼. `activeCategory`로 선택 상태 표시 |
| `PostList` | `components/post-list.tsx` | 글 카드 그리드(1/2/3열)와 빈 상태 메시지 |
| `SiteHeader` / `SiteFooter` | `components/site-*.tsx` | 공통 레이아웃 |

## 작성 규칙

- 직접 작성하는 코드는 4스페이스, `components/ui/**`는 shadcn 생성 상태(2스페이스)를 유지한다.
- 링크 형태의 버튼/뱃지는 `asChild`가 아니라 `render` prop을 사용한다 (`nativeButton={false}` 포함).
- 카드 안에 링크가 중첩되지 않도록, `PostCard`는 제목 링크의 `after:absolute after:inset-0`로 카드 전체를 클릭 가능하게 만든다. 카드 안에서는 `CategoryBadge`를 `linked`로 쓰지 않는다.
- 날짜는 `time` 요소와 `ko-KR` 로케일(`timeZone: "UTC"`)로 표시해 서버/클라이언트 간 하이드레이션 불일치를 막는다.

## 데이터/유틸 (Phase 2 더미 단계)

- `lib/dummy-data.ts`: Notion 응답을 모사한 `dummyPosts`(발행됨 4건, 초안 1건). Task 007에서 실제 API 호출로 교체한다.
- `lib/post-utils.ts`: `formatDate`, `generateSlug`, `getPublishedPosts`, `filterByCategory`, `filterByTag`, `searchPosts`, `getCategories`, `getTags`. 모두 순수 함수이며 카테고리/태그 비교는 대소문자를 구분하지 않는다.

## 글 상세 / slug (Phase 3)

- slug 형식: `{제목 slug}-{Notion 페이지 ID 뒤 8자리}` (예: `abc-476-풀이-7b566262`). Notion 페이지 ID의 앞부분은 생성 시각 기반이라 글끼리 같을 수 있으므로 **뒤 8자리**를 쓴다.
- 조회는 slug 끝의 식별자로만 매칭한다. 제목이 바뀐 뒤 옛 slug로 접근하면 현재 slug로 307 리다이렉트한다. 초안이거나 없는 글은 404.
- 본문은 `lib/notion.ts`의 `fetchPostBlocks`가 블록을 재귀로 가져오고, `components/notion-blocks.tsx`의 `NotionBlocks`가 렌더링한다.
- 지원 블록: 문단, 제목 1~3(h2~h4), 불릿/번호 리스트(중첩), 할 일, 인용, 콜아웃, 코드, 이미지, 구분선, 토글, 북마크/임베드(링크), 표. 그 외(영상/파일/수식 등)는 건너뛴다.
- 코드 하이라이팅, 이미지 최적화(`next/image`)는 각각 Task 011, 012에서 다룬다.
