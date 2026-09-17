# Development Guidelines

## 프로젝트 개요

- Notion 데이터베이스를 CMS로 사용하는 개인 개발 블로그. 스택: Next.js 16.3.2(App Router), TypeScript(strict), Tailwind CSS v4, shadcn/ui(`base-nova` 스타일, `@base-ui/react` 기반), `@notionhq/client`.
- 현재 진행 단계: `docs/ROADMAP.md` Phase 1 (Task 001, 골격 구축). `lib/notion.ts`, `lib/types.ts`, `/posts/[slug]`, `/category/[category]` 라우트는 아직 존재하지 않는다.
- 작업 전 반드시 `docs/PRD.md`(요구사항)와 `docs/ROADMAP.md`(현재 어느 Phase/Task인지)를 확인하고, 해당 Phase 범위를 벗어나는 작업(예: Phase 1 단계에서 Phase 3의 실제 Notion 연동 로직 구현)을 먼저 하지 않는다.

## "This is NOT the Next.js you know" 규칙 (AGENTS.md 연동)

- `node_modules`가 설치되어 있지 않은 상태에서는 `node_modules/next/dist/docs/`를 읽을 수 없다. 라우팅/서버 관련 코드(`app/**/route.ts`, `app/**/page.tsx`의 데이터 패칭, 미들웨어, 캐싱 API 등)를 작성하기 전에 먼저 `npm install`이 되어 있는지 확인하고, 되어 있다면 `node_modules/next/dist/docs/` 하위의 관련 가이드를 실제로 읽은 뒤 작성한다. 학습 데이터의 일반적인 Next.js 지식(특히 15 이하 버전 API)을 그대로 가정하지 않는다.
- `AGENTS.md`는 `next dev` 실행 시 자동으로 재생성되는 파일이다. 이 파일의 안내 블록을 임의로 삭제하거나 내용을 수정하지 않는다. 작업 중 diff에 이 파일의 변경이 나타나면 그대로 커밋에 포함시킨다(별도로 되돌리지 않는다).

## 코드 스타일 — 들여쓰기 이원화 (프로젝트 고유)

- `app/**`, `components/*.tsx`(단, `components/ui/` 제외), `lib/**` 등 **직접 작성하는 코드**는 4스페이스 들여쓰기를 사용한다 (`app/layout.tsx`, `app/page.tsx`, `components/site-header.tsx`, `components/theme-toggle.tsx` 참고).
- `components/ui/**`는 `shadcn`/`/add-component` 명령으로 생성된 파일이며 2스페이스 들여쓰기를 그대로 유지한다. 이 디렉터리 파일을 들여쓰기 일치를 이유로 4스페이스로 재포맷하지 않는다.
- 주석은 한국어로, 정말 필요한 경우(예: `components/theme-toggle.tsx`의 하이드레이션 관련 주석)에만 간단히 추가한다.

## Base UI 기반 컴포넌트 패턴 (shadcn `base-nova`)

- 이 프로젝트의 shadcn 컴포넌트는 Radix가 아니라 `@base-ui/react` 기반이다. 트리거/컨텐츠가 다른 엘리먼트로 렌더링되어야 할 때는 `asChild`가 아니라 `render` prop을 사용한다.
  - 올바른 예: `<Button nativeButton={false} render={<Link href="/demo" />}>데모 보기</Button>`, `<DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>...`
  - 잘못된 예: `<Button asChild><Link href="/demo">데모 보기</Link></Button>` (이 프로젝트에서 동작하지 않음)
- `next/link`로 이동하는 버튼/메뉴 항목은 항상 `nativeButton={false}` + `render={<Link .../>}` 조합을 기존 `components/site-header.tsx`, `app/page.tsx` 패턴과 동일하게 사용한다.

## shadcn 컴포넌트 추가 규칙

- 새 shadcn UI 컴포넌트가 필요하면 파일을 직접 작성하지 말고 `/add-component <컴포넌트명>` 커맨드를 사용한다 (`.claude/commands/add-component.md` 참고).
- 설치 전 `components/ui/`에 이미 존재하는지 확인하고, 존재하면 사용자에게 먼저 확인 후 덮어쓴다.
- 설치된 컴포넌트는 `cn()`(`@/lib/utils`) 사용 여부, `class-variance-authority`(cva) 패턴, `@base-ui/react` 래핑 방식이 기존 `components/ui/button.tsx` 등과 일치하는지 점검하고 불일치 시 맞춘다.

## Import 및 경로 별칭

- 모든 내부 모듈 import는 상대경로 대신 `@/*` 별칭을 사용한다 (`tsconfig.json`의 `paths`, `components.json`의 `aliases`와 일치): `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.
- 새 유틸리티 함수는 `lib/utils.ts`에 있는 `cn()` 패턴과 동일한 방식으로 `lib/` 아래에 추가한다.

## Notion 연동 구현 규칙 (Phase 3 진입 시 적용)

- Notion 클라이언트 초기화는 `lib/notion.ts` 한 곳에서만 수행한다. 페이지/컴포넌트에서 `@notionhq/client`를 직접 import하지 않고 `lib/notion.ts`가 export하는 함수를 통해서만 호출한다.
- `Post`, `Category`, `Tag` 등 타입은 `lib/types.ts`에 정의하고, PRD 5번(Title/Category/Tags/Published/Status/Content) 필드 매핑을 그대로 따른다. 새 Notion 속성을 추가로 쓸 경우 `lib/types.ts`와 `docs/PRD.md` 5번 표를 함께 갱신한다.
- 글 목록/카테고리 쿼리는 반드시 `Status = 발행됨` 필터를 포함해야 한다. 이 필터가 빠진 쿼리 함수를 추가하지 않는다.
- 환경 변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID` 등)는 `.env.local`에만 두고, 어떤 경우에도 커밋하거나 클라이언트 컴포넌트(`"use client"`)에 노출하지 않는다.

## 라우트/페이지 작업 시 동시 수정 대상

- `/posts/[slug]`를 구현할 때는 `app/posts/[slug]/page.tsx`와 함께 존재하지 않는 slug에 대한 404 처리(Next.js `notFound()`)를 같이 구현한다. 하나만 하고 끝내지 않는다.
- `/category/[category]`를 구현할 때는 `components/site-header.tsx`의 `navItems`나 카테고리 노출 UI가 실제 카테고리 데이터와 어긋나지 않는지 함께 점검한다.
- Phase 1~2 단계(더미 데이터)에서 만든 UI를 Phase 3에서 실제 데이터로 교체할 때는 컴포넌트 파일을 새로 만들지 않고 기존 컴포넌트의 props/데이터 소스만 교체한다.

## ROADMAP 동기화 규칙

- `docs/ROADMAP.md`에 정의된 Task를 완료하면 해당 Task 줄에 `✅ - 완료`로 표기하고 관련 문서/커밋 참조를 남긴다. Task를 시작만 하고 완료 기준을 충족하지 못했다면 상태 표기를 변경하지 않는다.
- 한 Phase의 모든 Task가 끝나면 Phase 제목 옆에 `✅`를 추가한다.

## 커밋/커뮤니케이션

- 커밋 메시지, PR 설명 중 본문, 코드 주석, 사용자 응답은 한국어로 작성한다. 변수명/함수명/타입명은 영어(camelCase, 컴포넌트는 PascalCase)를 사용한다.
- 커밋 생성 시 가능하면 `/commit` 커맨드를 사용하고, `.claude/commands/add-component.md`에 명시된 대로 컴포넌트 추가 작업 자체는 별도 커밋 요청 없이는 커밋하지 않는다.

## 금지 사항

- `components/ui/**` 파일의 들여쓰기·포맷을 프로젝트 전역 스타일(4스페이스)에 맞춘다는 이유로 임의 재포맷하지 않는다.
- Notion 연동 코드에서 `Status ≠ 발행됨`(초안 등)인 글을 목록/상세/카테고리 어디에도 노출하지 않는다.
- `AGENTS.md`의 자동 생성 경고 블록을 삭제하거나 손으로 다시 쓰지 않는다.
- `.env.local`, Notion API 키, 데이터베이스 ID 등 민감 정보를 커밋하거나 로그로 출력하지 않는다.
- shadcn 컴포넌트를 `/add-component`를 거치지 않고 `components/ui/`에 수동으로 새로 작성하지 않는다.
