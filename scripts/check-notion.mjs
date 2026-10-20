// Notion 데이터베이스 연결 확인 스크립트 (Task 003)
// 실행: node --env-file=.env.local scripts/check-notion.mjs
import { Client } from "@notionhq/client";

const apiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

// 표준 출력 헬퍼 (console.log 대신 사용)
const print = (message) => process.stdout.write(`${message}\n`);

// 필수 속성 목록 (docs/PRD.md 5번 표 기준)
const requiredProperties = {
    Title: "title",
    Category: "select",
    Tags: "multi_select",
    Published: "date",
    Status: "select",
};

/** 환경 변수 누락 여부를 검사하고 없으면 종료한다. */
function assertEnv() {
    if (!apiKey || !databaseId) {
        process.stderr.write(
            "NOTION_API_KEY 또는 NOTION_DATABASE_ID가 .env.local에 없습니다.\n",
        );
        process.exit(1);
    }
}

/** 속성 값에서 사람이 읽을 수 있는 문자열을 뽑아낸다. */
function readProperty(property) {
    switch (property?.type) {
        case "title":
            return property.title.map((t) => t.plain_text).join("");
        case "select":
            return property.select?.name ?? "-";
        case "multi_select":
            return property.multi_select.map((s) => s.name).join(", ") || "-";
        case "date":
            return property.date?.start ?? "-";
        default:
            return "-";
    }
}

/** 데이터베이스 → 데이터 소스 조회 후 스키마 검증과 글 목록을 출력한다. */
async function main() {
    assertEnv();
    const notion = new Client({ auth: apiKey });

    // v5에서는 database 아래 data source를 통해 조회한다.
    const database = await notion.databases.retrieve({
        database_id: databaseId,
    });
    const dataSourceId = database.data_sources?.[0]?.id;
    if (!dataSourceId) {
        throw new Error("데이터베이스에서 data source를 찾지 못했습니다.");
    }
    print(`데이터베이스 연결 성공 (data source: ${dataSourceId})`);

    // 스키마 검증
    const dataSource = await notion.dataSources.retrieve({
        data_source_id: dataSourceId,
    });
    let schemaOk = true;
    for (const [name, type] of Object.entries(requiredProperties)) {
        const actual = dataSource.properties[name]?.type;
        const ok = actual === type;
        schemaOk &&= ok;
        print(`  ${ok ? "OK  " : "FAIL"} ${name} (기대: ${type}, 실제: ${actual ?? "없음"})`);
    }

    // 전체 글 조회 (초안/발행됨 모두)
    const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
    });
    print(`\n글 ${response.results.length}건:`);
    for (const page of response.results) {
        if (!("properties" in page)) continue;
        const p = page.properties;
        print(
            `  - [${readProperty(p.Status)}] ${readProperty(p.Title)} | ` +
                `${readProperty(p.Category)} | ${readProperty(p.Tags)} | ${readProperty(p.Published)}`,
        );
    }

    print(schemaOk ? "\n스키마 검증 통과" : "\n스키마 검증 실패: 위 FAIL 항목을 확인하세요.");
    process.exitCode = schemaOk ? 0 : 1;
}

main().catch((error) => {
    process.stderr.write(`실패: ${error.code ?? ""} ${error.message}\n`);
    process.exitCode = 1;
});
