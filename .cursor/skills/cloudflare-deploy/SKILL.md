---
name: cloudflare-deploy
description: >-
  Optimize and deploy this Next.js Fumadocs site to Cloudflare Workers via
  OpenNext. Use when deploying to Cloudflare, fixing Error 1102, tuning
  open-next.config.ts or wrangler.jsonc, or running npm run deploy/preview.
---

# Cloudflare Workers 部署（OpenNext）

本站用 **@opennextjs/cloudflare** 把 Next.js 16 部署到 **Cloudflare Workers**（不是 Cloudflare Pages 纯静态托管）。

线上 Worker 名：`thinking-in-minecraft`  
默认域名：`https://thinking-in-minecraft.ref-dreamtowards.workers.dev`

## 关键文件

| 文件 | 作用 |
|---|---|
| `open-next.config.ts` | OpenNext 缓存与拦截策略 |
| `wrangler.jsonc` | Worker 名称、assets、`nodejs_compat` |
| `public/_headers` | `/_next/static/*` 长期缓存 |
| `next.config.mjs` 末尾 | `initOpenNextCloudflareForDev()` |
| `package.json` | `preview` / `deploy` / `upload` 脚本 |

不要提交：`.open-next/`、`.wrangler/`、`.dev.vars*`（已在 `.gitignore`）。

## 本站缓存策略（必守）

这是 **全静态 SSG** 文档站（`revalidate = false`，构建时预渲染）。必须启用静态资源增量缓存，否则刷新会反复启动完整 Next.js，触发 **Error 1102（Worker exceeded resource limits）**。

`open-next.config.ts` 应保持：

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
```

`wrangler.jsonc` 对本站 **只需** `ASSETS` binding；**不要**加 `WORKER_SELF_REFERENCE` 或 `IMAGES`（除非后续启用 R2 缓存或 `next/image` 优化）。

部署时 `opennextjs-cloudflare deploy` 会自动 `populateCache`，上传 `cdn-cgi/_next_cache/...` 到 Static Assets。

## 部署流程

### 首次

```bash
npx wrangler login    # 浏览器授权 Cloudflare
npm run deploy        # build + populateCache + wrangler deploy
```

### 日常更新

```bash
npm run deploy
```

### 本地 Workers 预览

```bash
npm run preview
```

Windows 上 OpenNext 可用但不稳定；本地 preview/build 失败时优先 WSL，或依赖 Cloudflare Git 构建（Linux）。

## 部署后验证

至少检查：

1. `/`、`/prelude/method`、`/history/infiniminer` 返回 200
2. 同一文档页 **连续刷新 10+ 次** 不出现 1102/503
3. `/api/search?q=红石` 可用（唯一动态路由，冷启动 CPU 较高属正常）

自定义域名：Cloudflare Dashboard → Workers → `thinking-in-minecraft` → Domains & Routes（当前 `metadataBase` 指向 `https://elytra.dev/thinking-in-minecraft`）。

## Error 1102 排查

| 现象 | 常见原因 | 处理 |
|---|---|---|
| 首次 OK，刷新 1102 | 未启用 SSG 静态缓存 | 确认 `open-next.config.ts` 如上 |
| 部署后仍 1102 | 缓存未 populate | 重新 `npm run deploy`（不要只跑 `wrangler deploy`） |
| 仅搜索/API 偶发 1102 | 动态路由冷启动 CPU 高 | 可接受；付费 Workers 可调 `limits.cpu_ms` |
| 构建 OK、运行异常 | Windows 本地构建 | 改用 WSL 或 CI 构建 |

**不要**对本站改用 `output: 'export'` 来「简化部署」——会丢失 `proxy.ts`、搜索 API 等能力。

## 优化注意点

1. **`proxy.ts`**：OpenNext 将其作为 Node.js middleware 打包（实验性）。仅处理 Markdown 协商；勿在 middleware 里做重 CPU 工作。
2. **`public/_headers`**：保持 `/_next/static/*` 的 `immutable` 缓存，减少重复拉取。
3. **`metadataBase`**：已在 root layout 设为 `https://elytra.dev/thinking-in-minecraft`。
4. **ISR / 按需 revalidate**：若将来启用，需改 R2 incremental cache + queue，见 [OpenNext Caching](https://opennext.js.org/cloudflare/caching)。当前站点不需要。
5. **bundle 体积**：Worker 包较大；靠 cache interception 让文档页绕过 NextServer，比缩小 bundle 更关键。

## Git 自动部署（Cloudflare Workers Builds）

| 步骤 | 命令 |
|---|---|
| Build | `npx @opennextjs/cloudflare build` |
| Deploy | `npx @opennextjs/cloudflare deploy` |

环境变量在 Dashboard → Settings → Variables 配置；勿把 secrets 写进仓库。

## 改完怎么验

1. `npm run types:check` 通过
2. `npm run deploy` 成功，日志含 `Successfully populated static assets cache`
3. 线上多页多次刷新无 1102
