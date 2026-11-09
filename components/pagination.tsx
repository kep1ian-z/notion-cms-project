import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    // 페이지 링크의 기준 경로 (예: "/", "/category/PS")
    basePath: string;
    // 페이지 이동 시 유지할 쿼리 (예: 검색어 q)
    query?: Record<string, string>;
}

// 이전/다음 이동 버튼. 페이지가 1개뿐이면 그리지 않는다
export function Pagination({
    currentPage,
    totalPages,
    basePath,
    query = {},
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    // 1페이지는 ?page= 없이 깔끔한 URL로 만든다
    const buildHref = (page: number) => {
        const params = new URLSearchParams(query);
        if (page > 1) {
            params.set("page", String(page));
        }
        const search = params.toString();
        return search ? `${basePath}?${search}` : basePath;
    };

    return (
        <nav
            aria-label="페이지 이동"
            className="flex items-center justify-center gap-4"
        >
            {currentPage > 1 ? (
                <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={buildHref(currentPage - 1)} />}
                >
                    <ChevronLeft />
                    이전
                </Button>
            ) : (
                <Button variant="outline" size="sm" disabled>
                    <ChevronLeft />
                    이전
                </Button>
            )}
            <span className="text-sm text-muted-foreground" aria-current="page">
                {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages ? (
                <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={buildHref(currentPage + 1)} />}
                >
                    다음
                    <ChevronRight />
                </Button>
            ) : (
                <Button variant="outline" size="sm" disabled>
                    다음
                    <ChevronRight />
                </Button>
            )}
        </nav>
    );
}
