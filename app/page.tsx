import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center">
            <Badge>Starter Kit</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Next.js 웹 스타터킷
            </h1>
            <p className="max-w-xl text-balance text-muted-foreground">
                Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui가 미리
                구성되어 있습니다. 바로 기능 개발을 시작해보세요.
            </p>
            <div className="flex items-center gap-3">
                <Button size="lg" nativeButton={false} render={<Link href="/demo" />}>
                    데모 보기
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    nativeButton={false}
                    render={
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                        />
                    }
                >
                    GitHub
                </Button>
            </div>
        </div>
    );
}
