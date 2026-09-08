export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Starter Kit. All rights reserved.</p>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                >
                    GitHub
                </a>
            </div>
        </footer>
    );
}
