import { bundledLanguages, codeToHtml } from "shiki";

// Notion 언어명 중 shiki 이름과 다른 것만 매핑한다
const LANGUAGE_ALIASES: Record<string, string> = {
    "plain text": "text",
    "c++": "cpp",
    "c#": "csharp",
    "f#": "fsharp",
    shell: "shellscript",
    "vb.net": "vb",
    webassembly: "wasm",
};

/** Notion 언어명을 shiki 언어명으로 바꾼다. 지원하지 않는 언어는 하이라이팅 없이 text로 처리한다. */
function resolveLanguage(notionLanguage: string): string {
    const language = LANGUAGE_ALIASES[notionLanguage] ?? notionLanguage;
    return language in bundledLanguages ? language : "text";
}

interface CodeBlockProps {
    code: string;
    // Notion code 블록의 language 값
    language: string;
}

// 서버에서 shiki로 문법 강조한 코드 블록. 라이트/다크 색은 CSS 변수로 함께 내려 테마 전환 시 다시 렌더링하지 않는다
export async function CodeBlock({ code, language }: CodeBlockProps) {
    const html = await codeToHtml(code, {
        lang: resolveLanguage(language),
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
    });

    return (
        <figure className="overflow-hidden rounded-lg border bg-muted/50">
            <div className="border-b px-4 py-1.5 font-mono text-xs text-muted-foreground">
                {language}
            </div>
            {/* shiki가 코드를 이스케이프한 HTML만 생성하므로 안전하다 */}
            <div
                className="shiki-block text-sm leading-6 [&_pre]:overflow-x-auto [&_pre]:p-4"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </figure>
    );
}
