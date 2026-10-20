# 스타일 가이드

블로그 UI는 Tailwind CSS v4 + shadcn/ui(`base-nova`, `@base-ui/react` 기반)로 구성한다. 컴포넌트 확인은 `/demo` 페이지에서 한다.

## 디자인 토큰

- 색상/반경 등은 `app/globals.css`의 CSS 변수(`--background`, `--primary`, `--muted-foreground` 등)를 사용한다. 색상 값을 직접 쓰지 않고 `bg-background`, `text-muted-foreground` 같은 시맨틱 클래스를 쓴다.
- 다크 모드는 `next-themes`가 처리하므로 컴포넌트에서 `dark:` 분기를 따로 만들지 않는다.

## 레이아웃

- 페이지 컨테이너: `mx-auto max-w-5xl px-4` (Header/Footer와 동일)
- 글 목록: `grid gap-4 sm:grid-cols-2` (모바일 1열, sm 이상 2열)
- 섹션 간격: `gap-16`, 섹션 내부: `gap-4`

## 블로그 컴포넌트

| 컴포넌트 | 파일 | 용도 |
|---|---|---|
| `PostCard` | `components/post-card.tsx` | 글 목록의 카드. 카드 전체가 `/posts/[slug]` 링크 |
| `CategoryBadge` | `components/category-badge.tsx` | 카테고리 뱃지. `linked`이면 `/category/[category]` 링크 |
| `TagList` | `components/tag-list.tsx` | 태그 목록(outline 뱃지). 태그가 없으면 렌더링하지 않음 |
| `SearchBar` | `components/search-bar.tsx` | 검색 입력. `onSearch`로 검색어 전달 (연동은 Task 010) |
| `SiteHeader` / `SiteFooter` | `components/site-*.tsx` | 공통 레이아웃 |

## 작성 규칙

- 직접 작성하는 코드는 4스페이스, `components/ui/**`는 shadcn 생성 상태(2스페이스)를 유지한다.
- 링크 형태의 버튼/뱃지는 `asChild`가 아니라 `render` prop을 사용한다 (`nativeButton={false}` 포함).
- 카드 안에 링크가 중첩되지 않도록, `PostCard`는 제목 링크의 `after:absolute after:inset-0`로 카드 전체를 클릭 가능하게 만든다. 카드 안에서는 `CategoryBadge`를 `linked`로 쓰지 않는다.
- 날짜는 `time` 요소와 `ko-KR` 로케일(`timeZone: "UTC"`)로 표시해 서버/클라이언트 간 하이드레이션 불일치를 막는다.
