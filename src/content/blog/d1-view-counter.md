---
title: '用 D1 给文章加浏览量计数'
description: 'SQLite 语义、边缘执行、免费额度内跑一个真实可用的计数器。'
pubDate: 2026-09-30
tags: ['Cloudflare', 'D1', 'Serverless']
draft: true
---

<!-- 草稿：还没实际做。做完再按真实过程写，别照大纲编。 -->

## 大纲

- 为什么是 D1 而不是 KV：计数需要原子自增，KV 最终一致
- wrangler.jsonc 里补 `main` 与 `d1_databases` 绑定，静态资源和 Worker 路由共存
- 表结构：`views(slug TEXT PRIMARY KEY, n INTEGER)`，`INSERT … ON CONFLICT DO UPDATE`
- 防刷：同一访客短时间内只计一次
- 文章页怎么取数、怎么展示，失败时静默降级
- 实际代码行数与免费额度占用
