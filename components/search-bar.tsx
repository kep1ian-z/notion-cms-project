import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    defaultValue?: string;
    placeholder?: string;
    // 검색어(q)를 전달할 경로
    action?: string;
}

// 제목/태그 검색용 입력 UI. GET 폼이라 제출하면 ?q=검색어 로 이동한다
export function SearchBar({
    defaultValue = "",
    placeholder = "제목 또는 태그로 검색",
    action = "/",
}: SearchBarProps) {
    return (
        <form
            role="search"
            action={action}
            className="flex w-full max-w-md items-center gap-2"
        >
            <Input
                type="search"
                name="q"
                defaultValue={defaultValue}
                placeholder={placeholder}
                aria-label="글 검색"
            />
            <Button type="submit" size="icon" aria-label="검색">
                <Search />
            </Button>
        </form>
    );
}
