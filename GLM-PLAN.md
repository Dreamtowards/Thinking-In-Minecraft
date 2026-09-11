# 《Minecraft 设计思想》MDX 拆分计划

> 工作文档:定义全书 63 章 + 序/附录如何映射为 `docs/` 下的 MDX 文件。
> 在本文上直接微调(改文件名、合并/拆分章节、改状态),调整完再动手铺文件。

---

## 一、拆分原则

| 层级 | 对应物 | 处理方式 |
|------|--------|----------|
| 卷 | 目录 `docs/<卷>/` | 一个卷一个目录,配一个 `index.mdx` 卷首页(短导读)和一个 `meta.json`(排序 + 部分隔符) |
| 部 | `meta.json` 里的 `---分隔符---` | **不建子目录**,保持 URL 扁平(`/history/acquisition` 而非 `/history/part2/acquisition`);部的归属写在每章开头的 `<Note>` 里 |
| 章 | 一个 `.mdx` 文件 | 默认粒度。文件名 = slug(英文 kebab-case),标题中文 |
| 超长章 | `slug/` 文件夹 + `index.mdx` | 例外预案,见 §六;初始一律不拆,写超了再拆 |

**统计**:序 3 篇 + 卷一 15 + 卷二 20 + 卷三 17 + 卷四 11 + 附录 3 = **69 篇**,含 5 个卷首页。

**状态标记**(微调时改):`☐ 未开始` / `▤ 骨架已铺` / `✎ 草稿` / `✔ 定稿`

---

## 二、完整文件树

```text
docs/
├── meta.json                      # 根导航(已存在,小改:补附录)
├── prelude/
│   ├── meta.json
│   ├── index.mdx                  # 序:这本书怎么读
│   ├── thesis.mdx                 # 全书的命题(复用现有文件名,重写内容)
│   └── method.mdx                 # 研究方法与体例(现象开篇、术语约定、材料来源)
├── history/                       # 卷一 · 历史与商业
│   ├── meta.json
│   ├── index.mdx                  # 卷一导读
│   ├── why-minecraft.mdx          # 01 为什么值得解剖 Minecraft
│   ├── prehistory.mdx             # 02 块状世界的史前史
│   ├── infiminer.mdx              # 03 Infiniminer:借来的火种
│   ├── notch.mdx                  # 04 Notch 与他的土壤
│   ├── classic-days.mdx           # 05 Cave Game 的头一百天
│   ├── paid-alpha.mdx             # 06 付费 Alpha:商业模式的即兴创作
│   ├── mojang.mdx                 # 07 Mojang:一家不会管理的公司
│   ├── platforms.mdx              # 08 全平台化
│   ├── acquisition.mdx            # 09 25 亿美元
│   ├── two-editions.mdx           # 10 双版本时代
│   ├── creator-economy.mdx        # 11 创作者经济
│   ├── attention-machine.mdx      # 12 注意力机器
│   ├── server-civilization.mdx    # 13 服务器文明
│   ├── ip-universe.mdx            # 14 IP 宇宙与后继者
│   └── business-postmortem.mdx    # 15 商业复盘
├── design/                        # 卷二 · 游戏设计
│   ├── meta.json
│   ├── index.mdx                  # 卷二导读
│   ├── blocks.mdx                 # 01 方块:世界的基本粒子
│   ├── no-goals.mdx               # 02 没有目标的游戏
│   ├── emergence.mdx              # 03 涌现优先
│   ├── first-night.mdx            # 04 第一个夜晚
│   ├── rhythm.mdx                 # 05 节律
│   ├── terrain.mdx                # 06 地形:第一内容
│   ├── mobs.mdx                   # 07 怪物:习性即设计
│   ├── combat.mdx                 # 08 战斗之殇
│   ├── redstone-design.mdx        # 09 红石:低门槛的图灵机(卷三有 redstone-physics,slug 区分)
│   ├── villagers.mdx              # 10 村民与经济
│   ├── randomness.mdx             # 11 随机性设计
│   ├── the-end.mdx                # 12 世界之末
│   ├── farms.mdx                  # 13 农场:系统的对抗性使用
│   ├── speedrun.mdx               # 14 速通:元游戏的进化
│   ├── building.mdx               # 15 建造:方块的艺术
│   ├── server-society.mdx         # 16 服务器社会
│   ├── snapshots.mdx              # 17 快照与共创
│   ├── design-debt.mdx            # 18 设计债
│   ├── game-modes.mdx             # 19 一个游戏还是四个
│   └── sound-pixels.mdx           # 20 声音与像素
├── impl/                          # 卷三 · 技术实现
│   ├── meta.json
│   ├── index.mdx                  # 卷三导读
│   ├── everything-blocks.mdx      # 01 一切皆方块
│   ├── chunks.mdx                 # 02 区块:无限世界的单元
│   ├── save-formats.mdx           # 03 存档进化史
│   ├── seed-pipeline.mdx          # 04 种子的管线
│   ├── tick.mdx                   # 05 Tick:世界的时钟
│   ├── lighting.mdx               # 06 光照:隐藏的引擎
│   ├── pathfinding-ai.mdx         # 07 寻路与 AI
│   ├── redstone-physics.mdx       # 08 红石的物理
│   ├── chunk-meshing.mdx          # 09 区块网格
│   ├── renderdragon.mdx           # 10 RenderDragon
│   ├── protocol.mdx               # 11 协议
│   ├── server-engineering.mdx     # 12 服务端工程
│   ├── decompilation.mdx          # 13 反编译的十年
│   ├── mixin.mdx                  # 14 Mixin 与字节码
│   ├── dual-codebase.mdx          # 15 双代码库
│   ├── snapshots-ci.mdx           # 16 快照即 CI
│   └── performance.mdx            # 17 性能解剖
├── rewrite/                       # 卷四 · 重写
│   ├── meta.json
│   ├── index.mdx                  # 卷四导读
│   ├── why-rewrite.mdx            # 01 为什么重写
│   ├── tech-stack.mdx             # 02 技术选型
│   ├── legality.mdx               # 03 合法性边界
│   ├── data-structures.mdx        # 04 数据结构先行
│   ├── meshing-rendering.mdx      # 05 网格与渲染
│   ├── lighting-impl.mdx          # 06 光照
│   ├── terrain-gen.mdx            # 07 地形生成
│   ├── interaction.mdx            # 08 交互与手感
│   ├── persistence.mdx            # 09 存档与序列化
│   ├── multiplayer.mdx            # 10 多人架构
│   └── from-clone-to-work.mdx     # 11 从克隆到作品
└── appendix/                      # 附录(可选,不要就整目录砍掉)
    ├── meta.json
    ├── glossary.mdx               # 术语表
    ├── timeline.mdx               # 大事年表 2009–2026
    └── references.mdx             # 参考资料与延伸阅读
```

---

## 三、章节内容要点(写作范围界定)

> 每章只列 2–4 个要点,防止写作时跑偏;详细论述思路见会话中的目录方案。

### 序

| 文件 | 要点 | 状态 |
|------|------|------|
| `prelude/index.mdx` | 全书定位、三/四卷结构图、两条阅读路径(玩家线:卷一→卷二;开发者线:卷二→卷三→卷四) | ☐ |
| `prelude/thesis.mdx` | 全书命题:创作链(玩→造→传);为什么历史/设计/技术不能分开写 | ☐ |
| `prelude/method.mdx` | 现象开篇体例、术语约定(指向附录术语表)、史料与反编译版本的口径 | ☐ |

### 卷一 · 历史与商业

| 文件 | 要点 | 状态 |
|------|------|------|
| `index.mdx` | 卷导读:从"半成品"到最畅销游戏的三幕结构 | ☐ |
| `why-minecraft.mdx` | 销量/月活/播放量数据全景;三视角研究框架 | ☐ |
| `prehistory.mdx` | 乐高文化、体素渲染史;DF/DK/过山车大亨的基因:模拟、涌现、玩家主导 | ☐ |
| `infiminer.mdx` | 泄露源码与"挖矿+建造";Notch 删掉了什么——删掉目标 | ☐ |
| `notch.mdx` | King.com 训练、《Wurm Online》教训、Java/LWJGL 选择 | ☐ |
| `classic-days.mdx` | Classic 公开开发、TIGSource 反馈循环;"半成品公开"方法论 | ☐ |
| `paid-alpha.mdx` | 买断定价实验、周更节奏、"永不完工"哲学;独立游戏元年 | ☐ |
| `mojang.mdx` | 公司组建、移植危机、《0x10c》搁浅:单产品公司的脆弱 | ☐ |
| `platforms.mdx` | PE 与主机移植经济学(4J Studios);多版本分叉埋雷 | ☐ |
| `acquisition.mdx` | 收购全程:动机、条款、Notch 离场;买的是平台不是游戏 | ☐ |
| `two-editions.mdx` | Better Together、跨平台互通、双版合购:整合逻辑与社区代价 | ☐ |
| `creator-economy.mdx` | Marketplace/Minecoins 分成与审查;与免费 mod 生态的张力 | ☐ |
| `attention-machine.mdx` | YouTube 传播学:实况/红石/速通/Dream SMP 内容分层 | ☐ |
| `server-civilization.mdx` | Hypixel、2b2t、Realms:第三方服务器作为分布式 R&D | ☐ |
| `ip-universe.mdx` | 衍生游戏/电影/教育版;Roblox、UEFN、Terraria、Luanti、Hytale:为何类 MC 未击败 MC | ☐ |
| `business-postmortem.mdx` | 抽象"Minecraft 模式":买断+长运营+UGC+IP;可复制 vs 窗口红利 | ☐ |

### 卷二 · 游戏设计

| 文件 | 要点 | 状态 |
|------|------|------|
| `index.mdx` | 卷导读:没有设计的设计;四部结构(哲学→系统→玩家→演进) | ☐ |
| `blocks.mdx` | 统一网格:建造/资源/地形/交互共用一套语言;约束即美学 | ☐ |
| `no-goals.mdx` | 从末影龙到玩家自定目标;引导而不指路 | ☐ |
| `emergence.mdx` | 简单规则的乘法:红石、刷怪塔、水电梯 | ☐ |
| `first-night.mdx` | 压力驱动的隐式教学;Wiki 作为隐性 UI;进度/配方书的补救 | ☐ |
| `rhythm.mdx` | 昼夜/饥饿/耐久/稀缺分布:再多挖一层的心理设计 | ☐ |
| `terrain.mdx` | 种子、群系、洞穴、结构:地形作为最大内容系统;1.18 得失 | ☐ |
| `mobs.mdx` | 苦力怕事故、末影人视线、昼夜分工:习性而非数值 | ☐ |
| `combat.mdx` | 1.9 攻击冷却与 PvP 分裂:核心机制重设计的风险管理 | ☐ |
| `redstone-design.mdx` | 从按钮灯到游戏内 CPU:低地板高天花板的样本 | ☐ |
| `villagers.mdx` | 职业/交易系统;最优化玩家攻破经济与再平衡 | ☐ |
| `randomness.mdx` | 附魔、钓鱼、战利品表:RNG 包装与玩家对策 | ☐ |
| `the-end.mdx` | 下界/末地:结构化内容的克制;鞘翅与终局移动 | ☐ |
| `farms.mdx` | 刷怪塔/铁傀儡机:对抗性使用;防农场补丁与反弹 | ☐ |
| `speedrun.mdx` | Bed 爆破、版本分级、规则协商:速通作为压力测试 | ☐ |
| `building.mdx` | 不做建造辅助;Hermitcraft 与建筑社区;表达只需方块 | ☐ |
| `server-society.mdx` | 小游戏服/剧情 SMP/无政府服:玩家发明、官方追认 | ☐ |
| `snapshots.mdx` | 年度大更新节奏、生物投票争议与取消:live-ops 设计 | ☐ |
| `design-debt.mdx` | 永不移除的机制、不敢动的合成表:向后兼容塑造设计 | ☐ |
| `game-modes.mdx` | 生存/创造/冒险/旁观:模式分裂与治愈系玩家 | ☐ |
| `sound-pixels.mdx` | C418 留白、16×16 克制、低保真 UI:反精致美学的理由 | ☐ |

### 卷三 · 技术实现

| 文件 | 要点 | 状态 |
|------|------|------|
| `index.mdx` | 卷导读:数据→模拟→渲染/网络→生态四部结构 | ☐ |
| `everything-blocks.mdx` | 方块 ID、BlockState、方块实体、注册表:数据驱动演进 | ☐ |
| `chunks.mdx` | 16×16×384、section、调色板压缩、流式加载 | ☐ |
| `save-formats.mdx` | mcregion→Anvil、NBT、LevelDB;DataFixerUpper 兼容工程 | ☐ |
| `seed-pipeline.mdx` | 噪声、密度函数、群系放置、jigsaw:1.18 后全流程 | ☐ |
| `tick.mdx` | 20 TPS 循环、随机 tick、实体管理、刷怪算法;单线程约束 | ☐ |
| `lighting.mdx` | 0–15 洪水填充、方块光/天光、跨区块传播:性能黑洞 | ☐ |
| `pathfinding-ai.mdx` | Goal 选择器、方块网格 A*:习性翻译成状态机 | ☐ |
| `redstone-physics.mdx` | 准连接性、更新顺序、BUD、tick 调度:怪癖的成因 | ☐ |
| `chunk-meshing.mdx` | 网格化、面剔除、AO:原版保守 vs Sodium/OptiFine 激进 | ☐ |
| `renderdragon.mdx` | Bedrock 统一渲染重写;双端分野与光影生态位 | ☐ |
| `protocol.mdx` | 包结构、客户端预测、服务器权威:反作弊先天困难 | ☐ |
| `server-engineering.mdx` | 单线程诅咒、1.14 卡顿事故、Paper 优化与 Folia 实验 | ☐ |
| `decompilation.mdx` | MCP→官方映射:mod 社区倒逼代码透明 | ☐ |
| `mixin.mdx` | Forge/Fabric 注入体系:运行时修改为何胜过 API | ☐ |
| `dual-codebase.mdx` | Java/C++ 分叉:特性同步成本,合并为何不可行 | ☐ |
| `snapshots-ci.mdx` | 每周快照、数据包实验场、社区测试网:持续交付文化 | ☐ |
| `performance.mdx` | 剖析卡顿存档:GC、模拟距离、实体数量、诊断方法论 | ☐ |

### 卷四 · 重写

| 文件 | 要点 | 状态 |
|------|------|------|
| `index.mdx` | 卷导读:从分析到动手;三种重写动机 | ☐ |
| `why-rewrite.mdx` | 学习型/创作型(Vintage Story)/平台型(Luanti);MVP 方块世界定义 | ☐ |
| `tech-stack.mdx` | 引擎 vs 自研;C#/Rust/C++/TS;Veloren、Luanti 先例 | ☐ |
| `legality.mdx` | 玩法不受保护、素材命名受保护;开源许可与致敬的分寸 | ☐ |
| `data-structures.mdx` | 区块存储、调色板、位压缩:世界表示先做对 | ☐ |
| `meshing-rendering.mdx` | 面剔除、greedy meshing、网格预算、视锥剔除 | ☐ |
| `lighting-impl.mdx` | 洪水填充与增量更新、跨区块传播 | ☐ |
| `terrain-gen.mdx` | 噪声→高度→洞穴→群系→结构:最小可行无限世界 | ☐ |
| `interaction.mdx` | 射线拾取、放置/破坏反馈、物品栏与合成 UX | ☐ |
| `persistence.mdx` | 原子写入、版本迁移:第一天为十年后打算 | ☐ |
| `multiplayer.mdx` | 权威模型、兴趣管理、状态同步:单机→联服改造顺序 | ☐ |
| `from-clone-to-work.mdx` | 差异化、性能工程(ECS vs OOP 教训)、社区冷启动 | ☐ |

### 附录

| 文件 | 要点 | 状态 |
|------|------|------|
| `glossary.mdx` | 全书术语统一表(区块、tick、快照、准连接性……) | ☐ |
| `timeline.mdx` | 2009–2026 大事年表(版本/商业/社区三轨) | ☐ |
| `references.mdx` | 访谈、发布会视频、反编译仓库、社区研究链接 | ☐ |

---

## 四、meta.json 草案

### 根 `docs/meta.json`(现文件基础上改)

```json
{
  "pages": [
    "---序---",
    "...prelude",
    "---卷一 · 历史---",
    "...history",
    "---卷二 · 设计---",
    "...design",
    "---卷三 · 技术实现---",
    "...impl",
    "---卷四 · 重写---",
    "...rewrite",
    "---附录---",
    "...appendix",
    "..."
  ]
}
```

### 各卷 `meta.json`(以卷一为例;其余同构,见 §二 的部划分)

```json
{
  "title": "卷一 · 历史与商业",
  "description": "一个半成品如何成为史上最畅销的游戏",
  "pages": [
    "index",
    "---第一部 · 诞生(2009 之前)---",
    "why-minecraft",
    "prehistory",
    "infiminer",
    "notch",
    "---第二部 · 崛起(2009–2014)---",
    "classic-days",
    "paid-alpha",
    "mojang",
    "platforms",
    "acquisition",
    "---第三部 · 帝国(2014 至今)---",
    "two-editions",
    "creator-economy",
    "attention-machine",
    "server-civilization",
    "ip-universe",
    "business-postmortem"
  ]
}
```

- 卷二四部:哲学(01–05)/ 系统解剖(06–12)/ 玩家的反抗(13–16)/ 演进的权衡(17–20)
- 卷三四部:数据模型(01–04)/ 模拟(05–08)/ 渲染与网络(09–12)/ 生态与工程文化(13–17)
- 卷四三部:决策(01–03)/ 核心引擎(04–08)/ 成为游戏(09–11)
- 序不设部:直接列 `index / thesis / method`

---

## 五、Frontmatter 与体例

每个章节文件:

```mdx
---
title: 方块:世界的基本粒子
description: 统一网格让建造、资源、地形、交互共享一套语言;约束即美学
icon: Box
---

<Note>第二卷 · 设计哲学之一</Note>

> **本章命题**:……(一句话,全书各章统一用这个开头钩子)

## 现象

(以玩家熟悉的名场面开篇)

## ……
```

- 章内编号用标题层级,不写死在 slug;`<Note>` 标注「卷 · 部」归属
- 跨卷对照用 Admonition 链接(如卷二红石章 ↔ 卷三 `redstone-physics`)
- icon 用 lucide 图标名;可后补,不阻塞铺骨架

---

## 六、超长章拆分预案(写超 2 万字再启用)

单章升级为文件夹:Flat page `slug.mdx` → `slug/index.mdx` + 子页,目录 `meta.json` 随之加子页名。

优先候补(按预计篇幅排):

1. `impl/chunks` → `index / palette-compression / streaming`
2. `impl/seed-pipeline` → `index / noise / biome-placement / structures`
3. `history/acquisition` → `index / timeline / motives`(史实密集,可能拆)
4. `design/terrain` → `index / worldgen-history / caves-cliffs`

---

## 七、现有文件处理(待你定夺)

| 现有文件 | 建议 |
|----------|------|
| `docs/prelude/index.mdx`、`thesis.mdx` | 文件名保留,内容按新大纲重写 |
| `docs/history/business.mdx` | 旧草稿 → 删除,或拆作第 06/07 章素材 |
| `docs/design/foundations.mdx`、`constraint.mdx` | 旧草稿 → 删除;`constraint` 主题部分可汇入 `design/blocks` |
| `docs/impl/`、`docs/rewrite/`、`docs/appendix/` | 目前不存在,新建(root meta 已引用 impl/rewrite,建目录前导航是空引用) |

---

## 八、实施步骤建议

1. **铺骨架**(一次 PR):按 §二 建 69 个文件,每个只含 frontmatter + 本章命题 blockquote + 三级小节占位;写全 §四 的 meta.json;处理 §七 的旧文件 → `next build` 应通过
2. **逐卷写作**:顺序建议 序 → 卷二(设计是全书论点核心)→ 卷一 → 卷三 → 卷四;每章成稿即改 §三 表格状态
3. **收尾**:附录三篇 + 全书交叉引用巡检 + 术语表回填
