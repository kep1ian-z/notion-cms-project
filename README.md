# 개인 개발 블로그 (Notion CMS)

Notion을 CMS로 활용한 개인 기술 블로그입니다. Notion 데이터베이스에 글을 작성하면 별도의 배포 작업 없이 웹사이트에 자동으로 반영됩니다.

## 주요 기능

- Notion 데이터베이스 기반 글 목록 조회
- 글 상세 페이지 (Notion 페이지 본문 렌더링)
- 카테고리별 필터링
- 검색 기능
- 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 15, TypeScript
- **CMS**: Notion API (`@notionhq/client`)
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

자세한 요구사항은 [docs/PRD.md](./docs/PRD.md) 문서를 참고하세요.

## Getting Started

먼저 개발 서버를 실행합니다.

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 결과를 확인할 수 있습니다.

### 환경 변수

Notion API 연동을 위해 프로젝트 루트에 `.env.local` 파일을 생성하고 아래 값을 설정해야 합니다.

```bash
NOTION_API_KEY=your_notion_integration_secret
NOTION_DATABASE_ID=your_notion_database_id
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js 기능 및 API 학습
- [Notion API Documentation](https://developers.notion.com/) - Notion API 사용법

## Deploy on Vercel

가장 쉬운 배포 방법은 Next.js 제작사인 Vercel의 [Vercel Platform](https://vercel.com/new)을 사용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.
