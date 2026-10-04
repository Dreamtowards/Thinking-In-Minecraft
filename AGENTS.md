# 《Minecraft设计思想》

面向 MC 资深爱好者与游戏开发者。任务源是根目录 `PLAN.md`：任务卡规定研究方向、材料边界与值得追问的问题，不代表结论已经确定。
口径见 `docs/prelude/method.mdx`，组件细节见 `.cursor/skills/fumadocs-mdx/SKILL.md`。回复用简体中文。

全书以研究问题为主，不预设一个必须守住的总答案。最新口径以 `PLAN.md` 为准；历史、设计、技术与第四卷 Reinvention 可以彼此校正。不要为了维护既有判断而忽略反例。

## 写章节

每章一个 `docs/**/*.mdx`。部文件夹带括号（如 `(part4)`），站点 URL 不含部名：链 `/history/competition`，不要写成 `/history/(part4)/competition`。

```mdx
---
title: 中文标题
description: 简介（40–80 字）
---

（从具体场面、事件或经验自然进入问题；可以提出当前判断，但不要机械放“本章命题”框。）

## ……按大纲的 H2

## 这一章留下什么
```

结尾：**爱好者一句 + 开发者一句**。开发者章必须写清能抄走 / 抄不走。篇幅：卷导读 800–1500 字；普通章 4000–8000 字；枢纽章 8000–12000 字。

### 文风与修订

- 正文只面对第一次读到当前版本的读者。**不要把修订过程写进正文**：不要解释“旧稿曾怎样写”、不要回应读者尚未遇到的旧误解，也不要为了证明这次改得更准确而留下“并不是 X 才 Y”“这里需要先澄清旧说法”之类的痕迹。事实应直接、自然地写成当前叙述。只有上下文本身确实会自然引出疑问时，才做澄清。
- **旧稿只是素材库，不是结构约束。** 重写一章时可以保留旧稿中的事实、案例、引用、图和有价值的观察，但标题、章节职责、论证顺序、结论、slug 都可以推翻重来。不要因为旧稿已经很长，就为旧框架补理由或“圆回来”。
- **标题说明研究对象，不替正文宣布结论。** 优先用“世界生成与探索”“生存与玩家目标”“物品、合成与库存”这类读者一眼知道在讲什么的标题，少用“意义机器”“默认状态”“约束即深度”这类要求正文替口号找证据的命题式标题。
- **章节按要回答的问题分工，不要求机制互不重叠。** 生存可以涉及物品、威胁、探索与建造；世界生成也可以涉及资源和进度。判断重复与否时，看两章是否在回答同一个问题，而不是看是否出现同一个机制。
- **先让具体对象和现象成立，再引入抽象术语。** 能先从第一晚、库存塞满、翻过山、找到结构、搭桥等经验进入，就不要一开头先抛“涌现”“设计合同”“空间语法”等分析词。术语应该帮助命名已经讲清的现象，而不是制造深刻感。
- **章节需要层次，不要把十几个小标题 flat 地铺成同级 H2。** 当同级 section 太多、读者看不出主线时，先把内容归成 2–4 个真正的大问题作为 `##`，再用 `###` 展开。例如“材料如何变成能力 → 库存如何限制与扩展 → 资源怎样进入长期循环”。层级必须反映真实逻辑，不要只为了视觉整齐机械套 H3。
- 一个 H2 应该代表一次明显的问题转向或论证阶段；H3 是同一大问题下的不同方面。若两个小节只是连续解释同一件事，优先合并，而不是为了目录丰富强行拆标题。
- 不要为了避免一种写法而刻意走向另一个极端。需要解释时就解释，需要保留一句有力的判断时就保留；目标是自然，不是机械遵守禁词。
- 段落要有呼吸，但不要形成“短句瀑布”。通常让一个段落承载一个完整的小意思，连续若干个单句段落只用于真正需要停顿、转折或强调的地方；反过来也不要把多个不同意思硬塞成一大段文字墙。完成初稿后应专门通读一次段落节奏，把“判断一句 / 补充一句 / 转折一句”这类连续碎段自然合并。
- 举例时让**一个例子承担一个明确作用**。不要在同一段里让一个游戏同时证明“视觉不是方块”“权限不完全开放”“物理用途不同”等多件事，导致论点切换太快。需要时拆成不同例子或不同段落。
- 对比其他游戏时，先说清比较维度，再举例。不要把 Terraria、Enshrouded、Teardown、Rising World、Roblox、VRChat 等写成“没做对的 Minecraft”；它们用于暴露 Minecraft 的取舍和边界，而不是为 Minecraft 背书。
- 重要判断尽量写成**有限、可检验的句子**，少从一个案例直接跳到普遍原则。例如“生存条件会改变当前优先级”通常比“生存给了玩家意义”更准确；“很多能力附着在物品上”比“角色成长是错误路线”更可信。
- 标题优先短而清楚，尤其 Sidebar 中尽量保持一行；较长的时间范围、解释性副题放进 description 或正文，不必都塞进标题。
- 少写“本章要证明”“真正值得注意的是”“这比 X 更重要”这类自动总结句。只有当正文已经给出足够材料、而总结确实帮助理解时再使用。
- 章末“这一章留下什么”只总结正文真正建立起来的判断。不要为了整齐固定条数，也不要把仍有争议的观察包装成“可迁移原则”；允许留下条件、反例或开放问题。

纪律：优先问「为什么」而不是罗列「有什么」；任务卡里的判断可以被正文材料修正，证据不足时可以保留开放问题。Java 与 Bedrock 在差异会改变论点时分述；模组 / 服务器 / 影像是正文。不写图鉴、攻略、开服手册、反编译清单。卷四按 **Reinvention / 下一代沙盒世界** 写，不要退回“现代技术重写 Minecraft”的架构选型书。

## 文章标签

Frontmatter 支持可选的 `tags: [modding, player-authorship, community]`。标签统一用英文，优先小写，多个单词用连字符连接，如 `worldgen`、`player-authorship`、`ugc`、`java`、`bedrock`；显示和 URL 直接使用英文标签，暂不添加翻译映射。通常每章选 3–5 个正文确实展开的主题，沿用已有标签名称；标签描述研究对象或问题，不预设结论。没有标签的文章可正常发布。卷归属由目录推导，不需要填写 `category` 或 `topic`。标签聚合目前只收录当前中文版；数据接口与使用约定见 `TAGGING.md`。

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

未在 `components/mdx.tsx` 注册的组件不要直接用。`Tabs` / `Tab`、`Steps` / `Step`、`Accordions` / `Accordion` 已注册。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
