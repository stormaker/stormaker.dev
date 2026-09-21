---
title: '第一篇'
description: '站点跑通了，这是占位的第一篇文章。'
pubDate: 2026-09-21
tags: ['随笔']
draft: false
---

站点已经跑起来了。删掉这篇，开始写你自己的。

## 写作约定

- 文件放 `src/content/blog/`，`.md` 或 `.mdx` 都行，文件名即 URL。
- frontmatter 必填 `title` / `description` / `pubDate`，可选 `tags` / `heroImage` / `updatedDate`。
- 写一半的文章加 `draft: true`：本地能预览，生产构建会整篇跳过，不进 RSS、不进 sitemap、不进搜索索引。

## 代码块

```ts
export function hello(name: string): string {
  return `hello, ${name}`;
}
```

行内代码 `npm run dev`，引用：

> 先发布，再完善。
