import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";

interface CategoryBadgeProps {
    category: Category;
    // true이면 카테고리 페이지로 이동하는 링크로 렌더링한다
    linked?: boolean;
}

// 글의 카테고리를 뱃지로 표시한다
export function CategoryBadge({ category, linked = false }: CategoryBadgeProps) {
    if (!linked) {
        return <Badge>{category}</Badge>;
    }

    return (
        <Badge
            render={<Link href={`/category/${encodeURIComponent(category)}`} />}
        >
            {category}
        </Badge>
    );
}
