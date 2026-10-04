# 文章标签

在当前中文版 `docs/**/*.mdx` 的 frontmatter 中添加可选的 `tags` 数组即可：

```yaml
tags: [modding, player-authorship, community]
```

未填写标签的文章照常显示。每章通常选择 3–5 个正文确实展开的主题，沿用已有名称；标签描述研究对象或问题，不提前确定结论。不要给每章添加没有区分度的 `Minecraft` 标签。

标签统一使用英文，优先小写，多个单词用连字符连接，例如 `modding`、`player-authorship`、`worldgen`、`persistent-world`、`ugc`、`ai`、`java`、`bedrock`。显示名称和 URL 直接使用英文标签，暂不维护翻译字典。相同主题沿用同一个标签，不混用 `mod`、`mods`、`modding`。

技术上保留标点支持：首尾空白会被移除，同一文章的重复标签只计一次，英文大小写视为同一标签；`c++`、`c#` 与 `c` 保持独立。标签显示名称取聚合顺序中首次出现的写法。

## 页面

- `/tags`：标签计数、搜索与已标记章节。
- `/tags/[tag]`：同一标签的跨卷章节，例如 `/tags/modding`；URL 对标准化后的标签进行编码，不删除标点。
- 文章标题下方：可点击标签。首页和文档导航均提供标签入口。

聚合范围是当前中文版的序言、四卷、番外、附录和全书目录，排除 `en`、`v2` 等其他版本，防止重复计数。添加或修改标签后，开发模式自动更新，生产站点需要重新构建发布。

## 数据接口

`lib/tags.ts` 提供 `getTaggedArticles()`、`getTagCounts()`、`getArticlesByTag(tag)`、`resolveTag(tag)` 和 `getTagData()`。文章数据包含 `url`、`title`、`description`、`volume`、`tags`，可用于后续地图；`volume` 从目录推导，无需新增 category/topic 字段。

- `GET /api/tags` → `{ tags: [{ id, tag, count }], articles: [...] }`
- `GET /api/tags?tag=modding` → `{ tag: { id, tag, count }, articles: [...] }`
- 未知标签返回 HTTP 404；无标签时总接口返回两个空数组。

查询参数需用 `URLSearchParams` 编码，例如 `c++` 中的加号。接口仅输出可序列化的元数据，不包含 MDX 正文或组件。

共享标签表示主题关联。未来若加入前置阅读、深入阅读或反例关系，应另行记录关系类型与理由。
