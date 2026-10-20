import Link from "next/link";

import { Button } from "@/components/ui/button";

// notFound() 호출 및 존재하지 않는 경로에 대한 404 화면
export default function NotFound() {
    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
            <p className="text-sm text-muted-foreground">404</p>
            <h1 className="text-3xl font-bold tracking-tight">
                페이지를 찾을 수 없습니다
            </h1>
            <p className="text-muted-foreground">
                주소가 잘못되었거나 발행되지 않은 글입니다.
            </p>
            <Button nativeButton={false} render={<Link href="/" />}>
                홈으로
            </Button>
        </div>
    );
}
