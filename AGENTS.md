# 《Minecraft设计思想》

面向 MC 资深爱好者与游戏开发者。任务源是根目录 `PLAN.md`：一次只写一章，按任务卡的标题、简介、大纲执行；不要改 `PLAN.md` 的状态。口径见 `docs/prelude/method.mdx`，组件细节见 `.cursor/skills/fumadocs-mdx/SKILL.md`。回复用简体中文。

总命题：Minecraft 不是被消费的关卡，而是一套允许被**居住、误用、再开发**的规则。

## 写章节

每章一个 `docs/**/*.mdx`。部文件夹带括号（如 `(part4)`），站点 URL 不含部名：链 `/history/competition`，不要写成 `/history/(part4)/competition`。

```mdx
---
title: 中文标题
description: 简介（40–80 字）
---

> **本章命题**：一句话，必须能被后文证伪或成立。

## 问题

## ……按大纲的 H2

## 这一章留下什么
```

结尾：**爱好者一句 + 开发者一句**。开发者章必须写清能抄走 / 抄不走。篇幅：卷导读 800–1500 字；普通章 4000–8000 字；枢纽章 8000–12000 字。

纪律：问「为什么」不问「有什么」；结论可被资深玩家证伪；Java 与 Bedrock 分述；模组 / 服务器 / 影像是正文。不写图鉴、攻略、开服手册、反编译清单。不要拿 `docs/` 旧草稿当论点。卷四不要提前写成定论。

## 脚注

史实、数字、引语用 GFM `[^id]`，定义放文末。

- 优先：官方稿、版本说明、公开访谈、可回溯的新闻或 `archive.org`。
- 数字给出处，或标明量级；不编精确数撑场面。
- 一条脚注写清：作者或机构，《标题》，载体，日期；见 URL。
- 同一来源多处引用，复用同一个 id。
- 能用玩家可观察的行为说清的，不下到反编译层。

## 组件

组件是排版，不是正文替代。优先 prose；只在信息类型确实需要区分时才加。**同类组件一章内通常不超过 3 个。** `<Note>` 只留关键一句，长段拆回正文。

| 用途 | 用 |
|------|------|
| 补充一句 | `<Note>` |
| 警告 / 易错 | `<Callout type="warning">` |
| 对照方案 | `<Alternative title="...">` |
| 亲历 / 轶事 | `<Memoir title="...">` |
| 可跳过的实现 | `<Impl title="...">` |
| 约束 + 评判 + 因果 | `<Constraint name verdict chain>`（`verdict`：地基 / 凑合 / 待定） |
| 章内交叉入口 | `<Cards>` + `<Card href="/…">` |
| 流程 | mermaid（节点写短，细节放 prose） |
| Java / Bedrock 代码 | `<CodeBlockTabs>` |

未在 `components/mdx.tsx` 注册的组件不要直接用（如 `Tabs`、`Steps`）。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
