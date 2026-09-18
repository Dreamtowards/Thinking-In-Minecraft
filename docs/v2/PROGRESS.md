# v2 写作进度

任务源：根目录 `PLAN.md`。体例见 `docs/prelude/method.mdx`（旧版口径仍有效）与本文末尾「写作规范摘要」。
状态：`☐` 未开始 · `✎` 已写待复查 · `✔` 已复查通过。

## 序（prelude）
- `prelude/thesis.mdx` 全书的命题 — ✔（1388 汉字，1 脚注，已复查）
- `prelude/method.mdx` 体例与方法 — ✔（1930 汉字，已复查）
- `prelude/index.mdx` 这本书怎么读 — ✔（898 汉字，已复查）

## 卷一 · 历史与商业（history）
- `history/index.mdx` 卷一导读 — ✔（主笔，约 950 汉字，已复查）
- `history/infiniminer.mdx` 01 从 Infiniminer 到 Cave Game — ✔（上一会话完成并提交）
- `history/alpha.mdx` 02 Alpha 的公开开发 — ✔（agent 写，4559 汉字，8 脚注；复查通过：脚注全部带可核出处，Survival Test 付费史实成立）
- `history/mojang-beta.mdx` 03 Mojang、Beta 与正式版 — ✔（agent 写，4691 汉字，6 脚注；复查：Mojang 成立日期经 Wikipedia 核验，修正 Far Lands 表述，通过）
- `history/mods-as-authors.mdx` 04 模组作为第二作者 · 枢纽 — ✔（agent 写，7565 汉字，9 脚注；复查通过：Bukkit 写成服务端作者席，收编史实有据，DMCA 时间线克制准确）
- `history/servers.mdx` 05 服务器即新游戏 · 枢纽 — ✔（agent 写，7707 汉字，7 脚注；复查通过：DMCA 修正为"下架通知"并引 GitHub 档案一手源，Hypixel 峰值 2021-04 21.6 万；我修了 3 处章名/时态引用）
- `history/media-education.mdx` 06 影像、教育与一代人的媒介 — ✔（agent 写，4582 汉字，8 脚注；复查通过：数据全部可溯源，还纠正了任务卡里 Chromebook 年份）
- `history/acquisition.mdx` 07 微软收购 — ✔（agent 写，4818 汉字，9 脚注；复查通过：恐惧清单对照结构好，微软新闻稿原话有源；我修了 1 处章名引用）
- `history/java-bedrock.mdx` 08 两条产品线 · 枢纽 — ✔（agent 写，7610 汉字，10 脚注；复查通过：8 行对照表按差异分层，迁移时间线经核验修正为 2022-03 强制关闭；我修了 1 处裸链接）
- `history/version-politics.mdx` 09 版本政治与更新哲学 — ✔（agent 写完后在自检阶段被限流打断，残留文件已是完整稿；我完成复查：5483 汉字，9 脚注；修正 2 处章名显示、1 处无据精确计数）
- `history/revenue.mdx` 10 收入结构（开发者章）— ✔（agent 写，约 4900 汉字，6 脚注；复查通过：三层结构图、中国版合同对照、抽成不成立的三条机制，Mojang 2013 财务按纪律降级为量级）
- `history/grey-economy.mdx` 11 模组、服务器与灰色经济 — ✔（主笔，4775 汉字，3 脚注；咽喉论收束「最开放 vs 最难抽成」，复用已核验来源，自查补字数与孤儿脚注）
- `history/competition.mdx` 12 竞争、模仿与产业影响 — ✔（agent 写，4970 汉字，6 脚注；复查通过：Roblox 三轴对照为主轴；我抽验了 Hytale 2025-2026 时间线——取消/买回/抢先体验全部属实）
- `history/heritage.mdx` 13 作为文化遗产的 Minecraft · 卷结语 — ✔（agent 写，4990 汉字，6 脚注；复查通过：四类保存对象、聊天举报管辖权双面写、卷结语到位；agent 修正了 Omniarchive 的表述）

## 卷二 · 游戏设计（design）
- `design/index.mdx` 卷二导读 — ✔（主笔，已复查）
- `design/voxel-primitive.mdx` 01 体素作为设计原语 — ✔（主笔，4154 CJK≈5200 字，2 脚注；「度量衡不是画风」立住，含两套空间/模组继承语法两处新论证）
- `design/verbs-feel.mdx` 02 最小动词集与手感 — ✔（主笔，3757 CJK≈4700 字；动词经济学+工具放大器立住；口径校准：本书字数统计按 CJK 计，PLAN 的 4000–8000「字」约对应 3200–6400 CJK，此后以此为验收线）
- `design/survival.mdx` 03 生存作为意义机器 — ✔（主笔，3237 CJK≈4050 字；周期装置/假进度真教学/自建安全/死亡克制立住；和平模式表述经修正）
- `design/creative-mode.mdx` 04 创造模式不是关卡编辑器 — ✔（主笔，3331 CJK≈4160 字；权限表 + 正交轴 + 寄生论证；冒险模式才是关卡编辑器的转折）
- `design/crafting-inventory.mdx` 05 合成、物品与库存 — ✔（主笔，约 3230 CJK≈4000 字；三分法成长/空间记忆/反 RPG 三换来）
- `design/worldgen.mdx` 06 世界生成即内容生产 — ✔（主笔，约 3260 CJK≈4080 字；生成合同四条款 + farlands 图）
- `design/redstone.mdx` 07 红石：把物理做成编程 · 枢纽 — ✔（agent 写，7524 汉字，7 脚注；复查通过：可误用系统三条判定正面定义，反事实检验完整；修正了任务卡日期；「齿轮顶班」细节加分）——**卷二至此全部完成**
- `design/commands-datapacks.mdx` 08 命令、数据包与地图 — ✔（agent 写，4663 汉字，5 脚注；复查通过：工具入编时间线全部核验，四条「该写系统了」的判定信号实用；我统一了 3 处链接章名）
- `design/mobs-combat.mdx` 09 生物、战斗与威胁 — ✔（主笔，3181 CJK≈3980 字；移动税/三 Boss 职责/不能做成动作游戏的四层理由）
- `design/dimensions-endgame.mdx` 10 维度、进度与终局 — ✔（主笔，约 3170 CJK≈3960 字；规则变体/建议式菜单/杠杆型奖励/终局留白被占领）
- `design/multiplayer.mdx` 11 多人是默认状态 — ✔（主笔，3292 CJK≈4115 字；社会隐喻/三半径/自然状态到契约/延迟的多人）
- `design/who-makes-rules.mdx` 12 规则由谁制定 — ✔（主笔，3164 CJK≈3955 字；三层立法表、mobGriefing 之辩、2b2t 显微镜）
- `design/mods-as-method.mdx` 13 模组作为设计方法 — ✔（主笔，3170 CJK≈3960 字；收编四原则+四反例、加系统vs加内容、策展即设计、工具层考题）
- `design/emergence.mdx` 14 留白、涌现与玩家作者性 — ✔（主笔，3156 CJK≈3945 字；目标外包的代价与差评的正当性、涌现的阴暗面、三款对照各写「不像」、同一权利）
- `design/constraints.mdx` 15 约束即深度 · 枢纽 — ✔（主笔，3141 CJK≈3930 字；让利审计、特例三判据含准连接性债务转资产、动词vs菜单停手原则）
- `design/transferable.mdx` 16 可迁移原则清单 · 卷结语 — ✔（主笔，2902 CJK；十二原则表带前提、四条不可复制条件单列、四种反面教材+换皮测试三步）

## 卷三 · 技术实现（impl）
- `impl/index.mdx` 卷三导读 — ✔（主笔，约 900 汉字，已复查）
- `impl/data-model.mdx` 01 体素世界的数据模型 — ✔（agent 写，4513 汉字，5 脚注；复查通过：账本比喻、七行对照表、高度预算论证，事实全部核验）
- `impl/storage.mdx` 02 存储与序列化 — ✔（agent 写，4934 汉字，8 脚注；复查通过：命题双向证伪、McRegion/Anvil/DFU 全部有据、18 处自查扎实）
- `impl/worldgen-pipeline.mdx` 03 世界生成管线 — ✔（主笔，3070 CJK≈3840 字；三义务反推管线、生命周期状态机、结构冲突缝线、种子合同免责条款）
- `impl/light-fluid-updates.mdx` 04 光照、流体与方块更新 — ✔（主笔，约 3230 CJK≈4040 字；三类刻日程表、连锁更新图计算、无限水耦合、观察者收编）
- `impl/tick.mdx` 05 游戏循环与刻 — ✔（主笔，约 3270 CJK≈4090 字；双钟分离、刻的种类总账、慢而不乱、看门狗）
- `impl/entities.mdx` 06 实体与碰撞 — ✔（主笔，约 3400 CJK≈4250 字；成本二分法、三类户口、寻路漏斗、官方减税四手段、网络维度副本）
- `impl/items.mdx` 07 物品、库存与合成 — ✔（主笔，约 3320 CJK≈4150 字；物品三重身份、自由停车场到具名车位、配方数据驱动、窗口权威、迁移地狱只增不减）
- `impl/redstone.mdx` 08 红石的实现 · 枢纽 — ✔（主笔，3388 CJK≈4235 字；准连接成因、更新顺序、四步社会过程、隐式VM三笔账）
- `impl/client-render.mdx` 09 客户端与渲染 — ✔（主笔，约 3060 CJK≈3820 字；网格化流水线、三层次剔除、贪婪网格的取舍、资源包合同、优化模组三层证据）
- `impl/protocol.mdx` 10 网络协议 — ✔（主笔，约 3190 CJK≈3990 字；单人即本地服务器、权威模型、三类同步与状态机、反作弊三层困境、未承认的公共 API）
- `impl/feel-client.mdx` 11 音频、粒子与手感谎言 — ✔（主笔，约 3230 CJK≈4040 字；模拟与反馈分工、位置音频与C418情绪层、粒子词汇表、预测与回滚信任、无障碍赎债论）
- `impl/mod-architecture.mdx` 12 模组与插件架构 — ✔（agent 写，6124 汉字，7 脚注；复查通过：注入即 API 论证完整、Forge/Fabric 哲学对照不站队、兼容矩阵三维）
- `impl/datapacks.mdx` 13 数据包、资源包与数据驱动 — ✔（主笔，约 3250 CJK≈4060 字；注册表插槽论、命名空间与标签、热重载、能做必须写代码表、晴雨区合同）
- `impl/java-runtime.mdx` 14 Java 版运行时 — ✔（主笔，约 3130 CJK≈3910 字；选项池评估、三项税与偿还史、启动器与版本隔离、LWJGL 国境、双边结论）
- `impl/bedrock.mdx` 15 Bedrock 作为另一次实现 — ✔（agent 写，5237 汉字，8 脚注；复查通过：六行语义分叉表、RenderDragon 时间线核验、脚本 API 表述分寸化）
- `impl/servers.mdx` 16 服务端与规模 — ✔（主笔，约 2970 CJK≈3710 字；规模变形论、谱系架构贡献、语义参考实现、Folia 民间答卷、兴趣管理一等公民）
- `impl/tech-debt.mdx` 17 技术债作为产品策略 — ✔（主笔，约 3370 CJK≈4210 字；债券还原神话、信用变现的窗口、债务总表六行、社会化清偿默契）
- `impl/modifiable-engine.mdx` 18 可被模组的引擎才是完整产品 · 卷结语 — ✔（主笔，约 3330 CJK≈4160 字；两个思想实验加定义权流动、四组回照、债转资产安检、五条内核加谱系检验、卷三结语）

## 卷四 · 重写（rewrite）
- `rewrite/index.mdx` 卷四导读 — ✔（主笔，约 800 汉字，已复查）
- `rewrite/what-to-rewrite.mdx` 01 我们到底在重写什么 — ✔（agent 写，3988 汉字，3 脚注；复查通过：四产品矩阵、局部重写三例、无选型推荐）
- `rewrite/invariants.mdx` 02 必须保留的设计不变量 — ✔（agent 写，5558 汉字，思辨章无脚注；复查通过：七条不变量各带四拍证伪，与十二原则/五内核逐条映射）
- `rewrite/accidents.mdx` 03 可以抛弃的历史偶然 — ✔（主笔，约 3000 CJK≈3750 字；四条偶然各配不变量安置方案，替代物先行纪律）
- `rewrite/world-rep.mdx` 04 世界表示 — ✔（主笔，约 3660 CJK≈4580 字；小游戏服的将就现状、内容寻址去重、组件定义权、仲裁回放故事、五维对照表）
- `rewrite/scheduler.mdx` 05 模拟调度 — ✔（主笔，约 3660 CJK≈4580 字；两服对比、三层兴趣声明、连通图发现、因果分级结算、因果所有权单元）
- `rewrite/scripting.mdx` 06 脚本与模组的双层 — ✔（主笔，约 3470 CJK≈4340 字；起床战争分工案例、崩溃域与作者胆量、语法同构、三层共治稳定面、晋升漏斗）
- `rewrite/network-perms.mdx` 07 网络、权限与社会功能下沉 — ✔（主笔，约 3450 CJK≈4310 字；重复立法三条件、所有权入籍、反作弊结构化、基元不是平台、权限矩阵化）
- `rewrite/render-tools.mdx` 08 渲染与创作工具 — ✔（主笔，约 3600 CJK≈4500 字；读法词典、调试器与因果契约、蓝图即凝固动词、资产图、三层同构）
- `rewrite/compat.mdx` 09 兼容性策略 — ✔（agent 写，4597 汉字，2 脚注；复查通过：伦理四步论证、红石双路径带四项代价、404 来源按纪律弃用）
- `rewrite/who-rewrites.mdx` 10 谁有权重写 — ✔（agent 写，3839 汉字，2 脚注；复查通过：三区分三主体三用户、非法律意见声明两处、Luanti 更名官方博文核验）
- `rewrite/seeing-the-original.mdx` 11 重写是为了看清原作 · 全书结语 — ✔（主笔，约 3330 CJK≈4160 字；清单定稿、三命题验收含一处修正、永不重写的四层价值、全书结语）

## 附录（appendix）
- `appendix/timeline.mdx` 年表 — ✔（agent 写，893 汉字，18 年份三轨表；核验约 25 条目，纠错「1.8 战斗」误标，未核条目按纪律不写）
- `appendix/people.mdx` 人物与组织 — ✔（agent 写，2332 汉字；7 人 12 组织全部取自正编核验事实，Kaplan 等不确定人物未写）
- `appendix/java-bedrock.mdx` Java / Bedrock 对照表 — ✔（agent 写，1548 汉字；四层 21 行对照，每行链正编）
- `appendix/glossary.mdx` 术语表— ✔（主笔，约 1351 汉字；五类三十余词，每词一句）
- `appendix/references.mdx` 文献与源 — ✔（agent 写，633 汉字；四层来源全部取自正编实际引用 URL）
- `appendix/exercises.mdx` 开发者实验题 — ✔（主笔，约 1970 汉字；八道题四件套）

## 收尾（状态截至 2026-09-18）
- 对比文档：新版 vs 旧版改进点 — ✔（docs/v2/IMPROVEMENTS.md：客观改进、文风对照、13 项事实纠错、保留与承认）
- 迁入站点（替换 `docs/`、补部 `meta.json`）— 用户没要求本次做，留待后续

---

## 写作规范摘要（给每个写作 agent 的完整 brief 用）

1. 文件放 `docs/v2/<卷>/<slug>.mdx`，frontmatter 只有 `title` 与 `description`（40–80 字）。
2. 正文开头 `> **本章命题**：…`；然后 `## 问题`；然后按任务卡大纲的 H2；结尾 `## 这一章留下什么`（爱好者一句 + 开发者一句，开发者章写清能抄走/抄不走）。
3. 文风：易读第一。短句为主，概念首现即解释；禁止自造黑话与过度压缩的对仗（旧版病：如「社区口呼」「墙上这是」「立法的测试集」）。问「为什么是这样而不是别的」。关键判断要写「怎样算这句错了」。偶尔轻幽默，一章至多两处。普通章 4500–7500 汉字；枢纽章 7500–10000；导读 800–1500。
4. Java/Bedrock 分述；模组/服务器/影像是正文；不写教程步骤、图鉴、合成表、反编译清单。
5. 脚注：GFM `[^id]` 定义文末，3–8 条/章；格式「作者或机构，《标题》，载体，日期；见 URL」。**每个 URL 必须 WebFetch 验证存在且内容相符**；验不了就写量级，绝不编数字和引语。
6. 组件（未注册的禁止使用：Callout/Cards/Card/Tabs/Steps/CodeBlockTabs）：`<Note>`、`<Alternative title>`、`<Memoir title>`、`<Impl title>`、`<Constraint name verdict chain>`、`<Figure src alt caption>`（仅已有图片 `/images/alpha-v1.2.6.png`、`/images/farlands.png`、`/images/redstone-computer.png`）、mermaid 代码块 ≤1。同类 ≤3，优先 prose。交叉引用用 Markdown 链接列表，URL 不含部名（如 `/history/servers`），只链 PLAN 目录内的章节。
7. 每章写完：作者 agent 通读自查；主 agent 复查（结构 + 抽读 + 脚注抽样核验）后标 `✔`。
