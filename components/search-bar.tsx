"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    defaultValue?: string;
    placeholder?: string;
    // 검색어 제출 시 호출된다 (실제 검색 연동은 Task 010)
    onSearch?: (keyword: string) => void;
}

// 제목/태그 검색용 입력 UI
export function SearchBar({
    defaultValue = "",
    placeholder = "제목 또는 태그로 검색",
    onSearch,
}: SearchBarProps) {
    const [keyword, setKeyword] = useState(defaultValue);

    return (
        <form
            role="search"
            className="flex w-full max-w-md items-center gap-2"
            onSubmit={(event) => {
                event.preventDefault();
                onSearch?.(keyword.trim());
            }}
        >
            <Input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={placeholder}
                aria-label="글 검색"
            />
            <Button type="submit" size="icon" aria-label="검색">
                <Search />
            </Button>
        </form>
    );
}
