# stormaker.dev

个人技术博客。Astro 静态输出，托管在 Cloudflare Workers（静态资源模式），域名 `stormaker.dev`。

## 写文章

**写作、修改、发布的完整流程见 [WRITING.md](./WRITING.md)。**

最短路径：在 `src/content/blog/` 里写一个 `.md` 文件，push 到 `astro-blog` 分支，约 1 分钟后上线。

> **当前分支是 `astro-blog`，不是 `main`。** 这个仓库的 `main` 上还是旧的 Next.js 站点，Cloudflare 的生产分支已经指向 `astro-blog`。
> 等确定不要旧站了，再把这个分支合进 `main`，并把 Dashboard 里的生产分支改回 `main`，**两步要一起做**。

## 构建与预览

```bash
npm run build      # astro build + pagefind 生成搜索索引 → dist/
npm run preview    # 本地跑构建产物
npm run check      # 类型检查
```

**搜索只在 build 之后可用**：Pagefind 的索引是构建完扫 `dist/` 生成的，`npm run dev` 下 `/search` 会显示提示而不是搜索框。

## 部署

**已接好 Workers Builds：push 到 `astro-blog` 自动构建并上线**，约 1 分钟。其他分支 push 只上传预览版本，不影响线上。构建日志在 Dashboard → Workers → stormaker-dev → Deployments。

Cloudflare 侧的配置（Settings → Builds）：生产分支 `astro-blog`，构建命令 `npm run build`，部署命令 `npx wrangler deploy`。自定义域写在 `wrangler.jsonc` 的 `routes` 里，每次部署都会带上。

紧急情况下可以绕过 Git 手动发版：`npm run build && npx wrangler deploy`。

Node 版本由 `.nvmrc` 指定（24）。

## 要改的地方

| 想改什么 | 改哪里 |
|---|---|
| 站点标题 / 简介 / 社交链接 | `src/consts.ts` |
| 导航栏条目 | `src/consts.ts` 的 `NAV_LINKS` |
| 首页简介 / 「最近在写」 | `src/consts.ts` 的 `SITE_DESCRIPTION` / `NOW_WRITING` |
| 首页大标题 | `src/pages/index.astro` 的 `<h1>` |
| 关于页 | `src/pages/about.astro` |
| 全站配色（冰川晨海 token）、字号 | `src/styles/global.css` 顶部 |
| 文章页排版 | `src/layouts/BlogPost.astro` |
| 响应头 / 缓存策略 | `public/_headers` |

## 访问统计

Cloudflare Web Analytics（免费、无 cookie、不需要合规弹窗）：
Dashboard → Analytics & Logs → Web Analytics → 添加 `stormaker.dev`，把拿到的 token 填进 `src/consts.ts` 的 `CF_ANALYTICS_TOKEN`。留空则不注入任何脚本。

## 评论

暂不加（2026-09-21 决定）。以后要加时，仓库是公开的，可以直接接 [giscus](https://giscus.app)（基于 GitHub Discussions，零后端）；若读者多数没有 GitHub 账号，再考虑 Waline 之类自带后端的方案，数据存 Cloudflare D1。

## 以后要加 Serverless API

比如浏览量计数、订阅表单。在 `wrangler.jsonc` 里加 `main` 指向一个 Worker 入口，再绑 KV 或 D1；静态资源和 Worker 路由可以共存于同一个域名。注释里已经写好了位置。
