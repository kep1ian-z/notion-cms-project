"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const noopSubscribe = () => () => {};

// 하이드레이션 불일치를 막기 위해 클라이언트 마운트 이후에만 아이콘을 렌더링
function useMounted() {
    return useSyncExternalStore(
        noopSubscribe,
        () => true,
        () => false
    );
}

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const mounted = useMounted();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" className="relative" />}
            >
                {mounted ? (
                    <>
                        <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    </>
                ) : (
                    <Sun className="size-4" />
                )}
                <span className="sr-only">테마 전환</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
