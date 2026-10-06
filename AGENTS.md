# 《Minecraft设计思想》

面向 Minecraft 资深爱好者与游戏开发者。根目录 `PLAN.md` 是当前任务与卷结构的最高优先级来源；任务卡规定研究方向、材料边界和值得追问的问题，不代表结论已经确定。方法口径见 `docs/prelude/method.mdx`，FumaDocs 组件细节见 `.cursor/skills/fumadocs-mdx/SKILL.md`。回复使用简体中文。

全书以问题为主，不预设必须守住的总答案。历史、设计、技术与第四卷 Reinvention 可以彼此校正；遇到更可靠的材料、反例或更好的结构时，应允许正文修正既有判断。

## 写章节

每章一个 `docs/**/*.mdx`。部文件夹带括号（如 `(part4)`），但站点 URL 不含部名：使用 `/history/competition`，不要写成 `/history/(part4)/competition`。

基本骨架可以很简单：

```mdx
---
title: 中文标题
description: 简介
---

（从具体对象、场面、事件或经验自然进入问题。）

## ……

## 这一章留下什么
```

标题、H2 数量、篇幅和组件都服务于文章本身，不设机械配额。卷导读通常比普通章短，枢纽章可以更长；以是否把问题讲完整为准。

## 写作原则

- **旧稿是素材，不是约束。** 可以保留事实、案例、引用、图和有价值的观察，但标题、slug、章节职责、结构、论证顺序和结论都可以推翻重来。不要为了保存旧稿而“圆”旧结构。
- **正文只面对第一次读到当前版本的读者。** 不泄露修订过程，不写“旧稿曾认为”“这里纠正之前的说法”等元叙事。直接自然地写当前最可靠的版本。
- **一章围绕一个核心问题建立主线。** 相邻章节可以讨论同一机制，但应回答不同问题。当前章只讲支撑本章问题所必需的背景，其余通过交叉链接移交，不要因为有关联就提前把下一章讲完。
- **按问题组织，不按关键词、源码类名或旧目录组织。** H2 表示真正的问题转向或论证阶段，H3 用来展开同一问题的不同方面。层级要让读者看出父子关系；如果几个小节其实连续解释同一件事，就自然合并。
- **先具体，再抽象。** 先把对象、现象、行为和因果讲清楚，再引入“涌现”“兼容性”“工作集”“设计合同”等抽象词。术语用于命名已经建立的认识，不用于制造深刻感。
- **结论由正文赢回来。** 标题优先说明研究对象，不抢着宣布宏大结论；正文也少用“本章要证明”“真正重要的是”之类自动总结。章末只总结已经建立起来的判断，允许保留条件、反例和开放问题。
- **判断要有限、可验证。** 不从单个案例跳成普遍真理。对比其他游戏时先明确比较维度，不把其他作品写成“没做对的 Minecraft”。
- **段落要自然。** 一个完整的小意思一个自然段；避免连续单句形成“短句瀑布”，也不要把多个不同意思压成文字墙。初稿完成后专门通读一次段落节奏。
- **例子只承担清楚的作用。** 一个例子不要同时证明多件互不相干的事；需要时换例子、换段落或拆成不同层级。
- **所有局部规则都服从清楚、自然、可信。** 不要为了避开某种写法而走向另一个极端，也不要把这里的建议机械执行成模板。

## 技术卷特别约定

技术章主要面向开发者，但应让熟悉 Minecraft 的读者也能顺着现象进入实现。

- 优先解释 **Why、边界和机制关系**，不要写成 API 图鉴、源码导览、反编译清单、配置手册或优化技巧清单。
- **当前实现细节是证据，不是文章骨架。** 先按问题和机制组织，再用类名、字段、Packet、Javadoc 或源码路径证明边界。不要反过来按 `ChunkHolder`、`DistanceManager`、`TicketStorage` 这样的类层次设计目录。
- 能用官方资料、公开 API、Javadoc 和可观察行为建立的事实，优先使用这些来源；只有当实现细节确实影响论点时才下到源码级。必要时可以研究源码，不必为了“避免实现细节”而牺牲准确性。
- Java 与 Bedrock 只有在差异会改变论点时分述，不为了完整而机械对照。
- 技术章结尾应兼顾两层价值：玩家能理解什么现象，开发者能迁移什么工程认识。必要时说明哪些思路值得继承、哪些 Minecraft 的具体实现不应照抄，但不要固定成模板句式。
- 模组、服务器实现和社区工具可以作为正文证据；讨论它们时优先解释它们解决了哪一层问题，而不是做推荐榜或安装指南。
- 卷四按 **Reinvention / 下一代沙盒世界** 写，不要退回“用现代技术重写 Minecraft”的架构选型书。

## 事实与引用

重要史实、版本行为、数字、论文结论、官方限制和当前实现应尽量查证。任务卡里的判断可以被材料修正，证据不足时可以保留开放问题。

史实、数字和引语使用 GFM `[^id]`，定义放文末。

- 优先使用官方稿、版本说明、公开访谈、论文、项目官方文档、公开 API / Javadoc，以及可回溯的新闻或 `archive.org`。
- 数字给出处，或明确只是量级；不要编造精确数字撑场面。
- 一条脚注写清作者或机构、《标题》、载体、日期与 URL；同一来源多处引用时复用同一个 id。
- 对当前版本实现，不要只凭旧 Wiki、旧教程或记忆；版本差异会影响论点时，应明确版本边界。

## MDX 与组件

Frontmatter 支持可选的 `tags: [modding, player-authorship, community]`。标签统一用英文，优先小写，多词用连字符，如 `worldgen`、`player-authorship`、`ugc`、`java`、`bedrock`。标签描述正文确实展开的研究对象或问题，不预设结论；沿用已有名称，通常不需要填写 `category` 或 `topic`。详细约定见 `TAGGING.md`。

组件是排版工具，不是正文替代。优先 prose；只有信息类型确实需要区分、图形确实比文字更清楚时才使用组件、表格、Mermaid 或 KaTeX。连续堆叠多个同类组件，通常意味着内容应该重新组织回正文。

| 用途 | 用 |
|------|------|
| 补充一句 | `<Note>` |
| 警告 / 易错 | `<Callout type="warning">` |
| 对照方案 | `<Alternative title="...">` |
| 亲历 / 轶事 | `<Memoir title="...">` |
| 可跳过的实现 | `<Impl title="...">` |
| 约束 + 评判 + 因果 | `<Constraint name verdict chain>`（`verdict`：地基 / 凑合 / 待定） |
| 章内交叉入口 | `<Cards>` + `<Card href="/…">` |
| 流程、分支、状态关系 | Mermaid（节点写短，细节放 prose） |
| Java / Bedrock 代码 | `<CodeBlockTabs>` |

未在 `components/mdx.tsx` 注册的组件不要直接使用。`Tabs` / `Tab`、`Steps` / `Step`、`Accordions` / `Accordion` 已注册。

KaTeX 行内公式使用 `$...$`，块级公式使用独立的 `$$...$$`。写文件时注意 `\frac`、`\alpha`、`\approx` 等反斜杠不要被字符串转义成隐藏控制字符。Mermaid 用于关系、分支和流程真正比 prose 更清楚的地方，不为增加“技术感”而画图。

## 交付前检查

完成章节后，至少做一次整体检查：

- 通读 H2 / H3，确认目录能看出文章在依次回答什么问题；
- 通读段落节奏，合并无意义的碎段，拆开明显的文字墙；
- 检查重要事实、版本边界和脚注是否真实支持正文；
- 检查旧标题、旧 slug、退休章节和交叉链接是否残留；
- 检查 Mermaid、KaTeX 与隐藏控制字符；
- 运行 `npm run build`，修到完整构建通过；
- 不顺手重写与当前任务无关的文件。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
