# 文章作者

MDX frontmatter 可选填 `authors`，兼容 Elytra 的作者格式。省略或填写空列表时不显示作者。

只填写名字：

```yaml
authors: [Dreamtowards, GPT-6]
```

需要标注分工时，可混用字符串与对象：

```yaml
authors:
  - Dreamtowards
  - name: GPT-6
    role: 研究与初稿
  - name: Claude
    role: 校对
```

标题下方显示第一位作者；有多位作者时显示 `+人数`，点击可展开完整名单与分工。单个作者的分工显示在悬停提示中。作者顺序沿用 frontmatter；不会自动填写或推断作者。
