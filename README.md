# stormaker.dev

个人技术博客。Astro 静态输出，托管在 Cloudflare Workers（静态资源模式），域名 `stormaker.dev`。

## 日常写作

```bash
npm run dev        # http://localhost:4321，改文件即热更新
```

新文章放 `src/content/blog/`，文件名即 URL（`hello.md` → `/blog/hello/`）：

```yaml
---
title: '标题'
description: '一句话摘要，进 <meta description>、RSS 和搜索结果'
pubDate: 2026-09-21
updatedDate: 2026-09-30   # 可选
tags: ['Cloudflare', 'Astro']
heroImage: '../../assets/xxx.jpg'   # 可选，相对路径，构建时会自动优化
draft: true               # 写一半就设 true
---
```

`draft: true` 的文章本地可见、线上完全不存在：不渲染页面、不进 RSS / sitemap / 搜索索引。所以草稿可以放心提交进仓库。

发布：把 `draft` 改成 `false`（或删掉这行），然后

```bash
git add . && git commit -m "post: 标题" && git push
```

Cloudflare 收到 push 自动构建上线，约 40 秒。

## 构建与预览

```bash
npm run build      # astro build + pagefind 生成搜索索引 → dist/
npm run preview    # 本地跑构建产物
npm run check      # 类型检查
```

**搜索只在 build 之后可用**：Pagefind 的索引是构建完扫 `dist/` 生成的，`npm run dev` 下 `/search` 会显示提示而不是搜索框。

## 部署

两种方式，配置都在 `wrangler.jsonc`：

- **自动**（推荐）：Cloudflare Dashboard → Workers → Import a repository，build 命令 `npm run build`，输出目录 `dist`。push 到 `main` 自动上线，其他分支出预览 URL。
- **手动**：`npm run build && npx wrangler deploy`

Node 版本由 `.nvmrc` 指定（24）。

## 要改的地方

| 想改什么 | 改哪里 |
|---|---|
| 站点标题 / 简介 / 社交链接 | `src/consts.ts` |
| 导航栏条目 | `src/consts.ts` 的 `NAV_LINKS` |
| 首页自我介绍 | `src/pages/index.astro` |
| 关于页 | `src/pages/about.astro` |
| 全站配色、字号 | `src/styles/global.css` |
| 文章页排版 | `src/layouts/BlogPost.astro` |
| 响应头 / 缓存策略 | `public/_headers` |

## 访问统计

Cloudflare Web Analytics（免费、无 cookie、不需要合规弹窗）：
Dashboard → Analytics & Logs → Web Analytics → 添加 `stormaker.dev`，把拿到的 token 填进 `src/consts.ts` 的 `CF_ANALYTICS_TOKEN`。留空则不注入任何脚本。

## 评论

暂无。本仓库是私有的，而 giscus 要求仓库公开（读者需要能访问它的 GitHub Discussions）。三个选择：

1. 把仓库改公开，再接 giscus——最省事，零后端。
2. 保持私有，另建一个空的公开仓库专门存放 Discussions，giscus 指向它。
3. 保持私有，用 Waline / Cusdis 之类自带后端的方案，配 Cloudflare D1 存数据。

## 以后要加 Serverless API

比如浏览量计数、订阅表单。在 `wrangler.jsonc` 里加 `main` 指向一个 Worker 入口，再绑 KV 或 D1；静态资源和 Worker 路由可以共存于同一个域名。注释里已经写好了位置。
