import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/demo", label: "Demo" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <Link href="/" className="font-semibold">
                    Starter Kit
                </Link>
                <div className="flex items-center gap-2">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink
                                        render={<Link href={item.href} />}
                                    >
                                        {item.label}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
