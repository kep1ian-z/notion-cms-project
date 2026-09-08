---
description: 'shadcn 컴포넌트를 프로젝트 컨벤션에 맞게 추가합니다'
argument-hint: '<컴포넌트명> [컴포넌트명2 ...]'
allowed-tools:
  [
    'Bash(npx shadcn:*)',
    'Bash(npx shadcn@latest:*)',
    'Read',
    'Glob',
    'Grep',
    'Edit',
  ]
---

# Claude 명령어: Add Component

shadcn 컴포넌트를 설치하고, 기존 `components/ui` 파일들과 스타일/컨벤션을 맞춥니다.

## 사용법

```
/add-component <컴포넌트명>
/add-component dialog tooltip
```

## 프로세스

1. `components.json` 확인 (style: base-nova, baseColor: neutral, iconLibrary: lucide)
2. 이미 설치된 컴포넌트인지 `components/ui/`에서 확인, 있으면 건너뛰고 알림
3. `npx shadcn@latest add <컴포넌트명>` 실행
4. 설치된 파일을 열어 기존 컴포넌트(`button.tsx`, `card.tsx` 등)와 비교
   - `cn()` 유틸(`@/lib/utils`) 사용 여부
   - `class-variance-authority`(cva) 패턴 일관성
   - Base UI(`@base-ui/react`) 기반 컴포넌트는 기존 패턴과 동일한 방식으로 래핑되어 있는지
   - `lucide-react` 아이콘 사용 시 기존 import 스타일과 일치하는지
5. 불일치하는 부분이 있으면 기존 컨벤션에 맞게 수정
6. 설치 결과와 컴포넌트 사용 예시(간단한 import + JSX 스니펫) 요약

## 참고사항

- 이미 존재하는 컴포넌트는 덮어쓰지 말고 사용자에게 먼저 확인
- 컴포넌트 관련 새 의존성이 추가되면 `package.json` 변경 사항을 알림
- 커밋은 하지 않음 (필요 시 `/commit` 별도 사용)
