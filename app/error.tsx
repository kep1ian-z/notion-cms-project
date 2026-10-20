"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

// 서버 컴포넌트(Notion 조회 등)에서 에러가 나면 보여줄 화면. 에러 상세는 노출하지 않는다
export default function Error({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
                글을 불러오지 못했습니다
            </h1>
            <p className="text-muted-foreground">
                일시적인 문제일 수 있습니다. 잠시 후 다시 시도해 주세요.
            </p>
            {error.digest && (
                <p className="font-mono text-xs text-muted-foreground">
                    오류 코드: {error.digest}
                </p>
            )}
            <div className="flex items-center gap-2">
                <Button onClick={() => retry()}>다시 시도</Button>
                <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/" />}
                >
                    홈으로
                </Button>
            </div>
        </div>
    );
}
