import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/lib/types";

interface TagListProps {
    tags: Tag[];
}

// 글에 붙은 태그 목록을 outline 뱃지로 표시한다
export function TagList({ tags }: TagListProps) {
    if (tags.length === 0) {
        return null;
    }

    return (
        <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
                <li key={tag}>
                    <Badge variant="outline">#{tag}</Badge>
                </li>
            ))}
        </ul>
    );
}
