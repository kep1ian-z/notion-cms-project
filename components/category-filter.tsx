import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
    categories: Category[];
    // 현재 선택된 카테고리. 없으면 "전체"가 선택된 상태
    activeCategory?: Category;
}

// 카테고리 이동 버튼 목록. 가로로 넘치면 줄바꿈된다
export function CategoryFilter({
    categories,
    activeCategory,
}: CategoryFilterProps) {
    return (
        <nav aria-label="카테고리" className="flex flex-wrap gap-2">
            <Button
                size="sm"
                variant={activeCategory ? "outline" : "default"}
                nativeButton={false}
                render={<Link href="/" />}
            >
                전체
            </Button>
            {categories.map((category) => (
                <Button
                    key={category}
                    size="sm"
                    variant={category === activeCategory ? "default" : "outline"}
                    nativeButton={false}
                    render={<Link href={`/category/${encodeURIComponent(category)}`} />}
                >
                    {category}
                </Button>
            ))}
        </nav>
    );
}
