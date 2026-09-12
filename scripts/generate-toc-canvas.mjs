import fs from 'node:fs';

const book = JSON.parse(
  fs.readFileSync('c:/dev/Projects/Thinking-In-Minecraft/lib/book-toc-data.json', 'utf8'),
);

const json = JSON.stringify(book, null, 2);

const src = `import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  TextInput,
  UsageBar,
  useCanvasState,
  useHostTheme,
  useMemo,
  type Color,
} from "cursor/canvas";

type Audience = "both" | "fan" | "dev";
type Tab = "overview" | "prelude" | "v1" | "v2" | "v3" | "v4" | "appendix" | "paths";
type Filter = "all" | "fan" | "dev" | "written";

type Chapter = {
  id: string;
  title: string;
  audience: Audience;
  desc: string;
  question: string;
  sections: string[];
  tags: string[];
  href: string | null;
  written: boolean;
};

type Part = {
  title: string;
  span: string;
  intent: string;
  chapters: Chapter[];
};

type Volume = {
  id: Tab | string;
  roman: string;
  short: string;
  english: string;
  color: Color | string;
  heading: string;
  thesis: string;
  payoffFan: string;
  payoffDev: string;
  parts: Part[];
};

type Book = {
  thesis: string;
  volumes: Volume[];
};

const BOOK: Book = ${json};

const PATHS = [
  ["设计师 / 玩法程序", "序 → 卷二全部 → 卷一 04–06、12 → 卷三 17–18", "卷三实现细节"],
  ["引擎 / 技术程序", "序 → 卷二 01–02、07 → 卷三全部 → 卷四", "卷一影像章可略"],
  ["制作人 / 商业", "卷一全部 → 卷二 11–16 → 卷三 15–17", "红石实现、渲染"],
  ["资深玩家通读", "按卷顺序；每章先读简介与「要回答」", "开发者侧重章可读命题与结尾"],
];

function chapterCount(v: Volume) {
  return v.parts.reduce((n, p) => n + p.chapters.length, 0);
}

function audienceLabel(a: Audience) {
  if (a === "fan") return "爱好者侧重";
  if (a === "dev") return "开发者侧重";
  return "两类读者";
}

function visible(ch: Chapter, filter: Filter, query: string) {
  if (filter === "written" && !ch.written) return false;
  if (filter === "fan" && ch.audience === "dev") return false;
  if (filter === "dev" && ch.audience === "fan") return false;
  if (!query) return true;
  const blob = [ch.title, ch.desc, ch.question, ...ch.sections].join("\\n").toLowerCase();
  return blob.includes(query);
}

export default function MinecraftDesignToc() {
  const theme = useHostTheme();
  const [tab, setTab] = useCanvasState<Tab>("tab", "overview");
  const [filter, setFilter] = useCanvasState<Filter>("filter", "all");
  const [query, setQuery] = useCanvasState("query", "");

  const totals = useMemo(() => {
    const chapters = BOOK.volumes.reduce((n, v) => n + chapterCount(v), 0);
    const parts = BOOK.volumes.reduce((n, v) => n + v.parts.length, 0);
    const written = BOOK.volumes.reduce(
      (n, v) => n + v.parts.reduce((m, p) => m + p.chapters.filter((c) => c.written).length, 0),
      0,
    );
    return { chapters, parts, volumes: BOOK.volumes.length, written };
  }, []);

  const q = query.trim().toLowerCase();
  const activeVolume = BOOK.volumes.find((v) => v.id === tab);

  return (
    <Stack gap={24}>
      <Stack gap={8}>
        <H1>《Minecraft设计思想》目录</H1>
        <Text tone="secondary">
          卷 → 部 → 章（简介、要回答、节大纲）。已成稿的章标「已写」。这是聊天旁的对照视图；站点上的同一份目录在 /toc。
        </Text>
      </Stack>

      <Row gap={24} wrap>
        <Stat value={String(totals.volumes)} label="卷（含序与附录）" />
        <Stat value={String(totals.parts)} label="部" />
        <Stat value={String(totals.chapters)} label="章" />
        <Stat value={\`\${totals.written}/\${totals.chapters}\`} label="已成稿" />
      </Row>

      <UsageBar
        total={totals.chapters}
        topLeftLabel="各卷章数"
        topRightLabel={\`\${totals.chapters} 章\`}
        segments={BOOK.volumes.map((v) => ({
          id: v.id,
          value: chapterCount(v),
          color: v.color as Color,
        }))}
      />

      <Row gap={8} wrap>
        <Pill active={tab === "overview"} onClick={() => setTab("overview")}>
          总览
        </Pill>
        <Pill active={tab === "prelude"} onClick={() => setTab("prelude")}>
          序
        </Pill>
        <Pill active={tab === "v1"} onClick={() => setTab("v1")}>
          卷一 历史
        </Pill>
        <Pill active={tab === "v2"} onClick={() => setTab("v2")}>
          卷二 设计
        </Pill>
        <Pill active={tab === "v3"} onClick={() => setTab("v3")}>
          卷三 技术
        </Pill>
        <Pill active={tab === "v4"} onClick={() => setTab("v4")}>
          卷四 重写
        </Pill>
        <Pill active={tab === "appendix"} onClick={() => setTab("appendix")}>
          附录
        </Pill>
        <Pill active={tab === "paths"} onClick={() => setTab("paths")}>
          路径
        </Pill>
        <Spacer />
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>
          全部读者
        </Pill>
        <Pill active={filter === "fan"} onClick={() => setFilter("fan")}>
          爱好者侧重
        </Pill>
        <Pill active={filter === "dev"} onClick={() => setFilter("dev")}>
          开发者侧重
        </Pill>
        <Pill active={filter === "written"} onClick={() => setFilter("written")}>
          只看已写
        </Pill>
      </Row>

      {tab !== "overview" && tab !== "paths" ? (
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="按章名、简介或节标题筛选…"
        />
      ) : null}

      {tab === "overview" ? <Overview /> : null}
      {tab === "paths" ? <Paths /> : null}
      {activeVolume ? (
        <VolumeView
          volume={activeVolume}
          filter={filter}
          query={q}
          accent={theme.accent.primary}
        />
      ) : null}
    </Stack>
  );
}

function Overview() {
  return (
    <Stack gap={20}>
      <Callout tone="info" title="总命题">
        {BOOK.thesis} 卷一写这套规则如何变成产业，卷二写它为何有效，卷三写它如何被拖进不可能的规模，卷四把偶然从本质里剥离。
      </Callout>

      <H2>四卷对照</H2>
      <Table
        headers={["卷", "核心命题", "章", "爱好者带走", "开发者带走"]}
        rows={BOOK.volumes.map((v) => [
          v.roman ? \`\${v.roman} \${v.short}\` : v.short,
          v.thesis,
          String(chapterCount(v)),
          v.payoffFan,
          v.payoffDev,
        ])}
        striped
      />

      <Grid columns={2} gap={16}>
        {BOOK.volumes.map((v) => (
          <div key={v.id}>
            <Card>
              <CardHeader trailing={\`\${v.parts.length} 部 · \${chapterCount(v)} 章\`}>
                {v.roman ? \`第\${v.roman}卷  \${v.short}\` : v.short}
              </CardHeader>
              <CardBody>
                <Stack gap={8}>
                  <Row gap={8} align="center">
                    <Swatch color={v.color as Color} />
                    <Text size="small" tone="tertiary">
                      {v.english}
                    </Text>
                  </Row>
                  <Text>{v.thesis}</Text>
                  <Divider />
                  {v.parts.map((p) => (
                    <Text key={p.title} size="small" tone="secondary">
                      {p.title}
                      {p.span ? \` · \${p.span}\` : ""}
                      {\` · \${p.chapters.length} 章\`}
                    </Text>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </div>
        ))}
      </Grid>
    </Stack>
  );
}

function Paths() {
  return (
    <Stack gap={16}>
      <H2>阅读路径</H2>
      <Text tone="secondary">
        两类读者共用总命题，随后分叉。卷四是考试，不是开工令。
      </Text>
      <Table headers={["你更像", "顺序", "可跳过"]} rows={PATHS} striped />
    </Stack>
  );
}

function VolumeView({
  volume,
  filter,
  query,
  accent,
}: {
  volume: Volume;
  filter: Filter;
  query: string;
  accent: string;
}) {
  let n = 0;
  return (
    <Stack gap={20}>
      <Stack gap={8}>
        <Text size="small" tone="tertiary">
          {volume.english}
        </Text>
        <H2>{volume.roman ? \`第 \${volume.roman} 卷 · \${volume.short}\` : volume.short}</H2>
        <Text>{volume.thesis}</Text>
        <Text size="small" tone="secondary">
          爱好者带走：{volume.payoffFan}
        </Text>
        <Text size="small" tone="secondary">
          开发者带走：{volume.payoffDev}
        </Text>
      </Stack>

      {volume.parts.map((part) => {
        const shown = part.chapters.filter((c) => visible(c, filter, query));
        const start = n;
        n += part.chapters.length;
        if (shown.length === 0) return null;
        return (
          <div key={part.title}>
            <Stack gap={10}>
              <Row gap={8} align="center">
                <H3>{part.title}</H3>
                {part.span ? (
                  <Text size="small" tone="tertiary">
                    {part.span}
                  </Text>
                ) : null}
              </Row>
              {part.intent ? <Text tone="secondary">{part.intent}</Text> : null}
              {part.chapters.map((ch, i) => {
                const num = start + i + 1;
                if (!visible(ch, filter, query)) return null;
                return (
                  <div key={ch.id}>
                    <CollapsibleSection
                      title={\`\${String(num).padStart(2, "0")}  \${ch.title}\`}
                      count={ch.sections.length}
                      defaultOpen={ch.written && !query}
                      trailing={
                        <Row gap={6}>
                          {ch.written ? <Pill size="sm">已写</Pill> : null}
                          <Text size="small" tone="tertiary">
                            {audienceLabel(ch.audience)}
                          </Text>
                        </Row>
                      }
                    >
                      <Stack gap={8}>
                        <Text>{ch.desc}</Text>
                        {ch.question ? (
                          <Text italic tone="secondary">
                            要回答：{ch.question}
                          </Text>
                        ) : null}
                        {ch.tags.length > 0 ? (
                          <Row gap={6}>
                            {ch.tags.map((t) => (
                              <Pill key={t} size="sm">
                                {t}
                              </Pill>
                            ))}
                          </Row>
                        ) : null}
                        {ch.sections.map((s, si) => (
                          <Text key={s} size="small">
                            <span style={{ color: accent }}>{si + 1}.</span> {s}
                          </Text>
                        ))}
                      </Stack>
                    </CollapsibleSection>
                  </div>
                );
              })}
            </Stack>
          </div>
        );
      })}
    </Stack>
  );
}
`;

fs.writeFileSync(
  'C:/Users/Dreamtowards/.cursor/projects/c-dev-Projects-Thinking-In-Minecraft/canvases/minecraft-design-toc.canvas.tsx',
  src,
  'utf8',
);
console.log('canvas bytes', Buffer.byteLength(src));
