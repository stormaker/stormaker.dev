---
title: 'Pagefind：给静态站加一个不需要后端的全文搜索'
description: '索引在构建时生成、查询在浏览器里完成。记录接入 Pagefind 的过程，以及中文检索、开发模式和样式覆盖上的几个细节。'
pubDate: 2026-09-21T16:00:00+08:00
tags: ['搜索', '静态站', 'Astro']
---

静态博客加搜索，常见的做法是接 Algolia 这类托管服务，或者自己起一个搜索后端。对个人博客来说都太重了。[Pagefind](https://pagefind.app) 走的是另一条路：**构建时生成索引，查询在浏览器里完成**，全程没有服务器。

## 它是怎么工作的

Pagefind 是一个命令行工具。站点构建完之后，它扫描产物目录里的 HTML，生成一组切好片的索引文件，和一个前端搜索组件一起放进产物目录。

用户搜索时，浏览器只下载和查询词相关的那几片索引，不需要一次拉下整个站的内容。文章多了，单次搜索的流量也不会线性增长。

## 接入：两步

第一步，装上它，把它接到构建命令后面：

```bash
npm i -D pagefind
```

```json
{
  "scripts": {
    "build": "astro build && pagefind --site dist"
  }
}
```

第二步，在搜索页里放上它的组件。Pagefind 1.5 起推荐用新的 Component UI，它是一组 Web Component，自带键盘导航和可访问性支持：

```html
<link rel="stylesheet" href="/pagefind/pagefind-component-ui.css" />
<script type="module" src="/pagefind/pagefind-component-ui.js"></script>

<pagefind-config lang="zh-cn"></pagefind-config>
<pagefind-searchbox placeholder="搜索文章" show-sub-results="true"></pagefind-searchbox>
```

旧的 `PagefindUI` 构造函数写法仍然能用，但构建时 Pagefind 会提示新项目改用 Component UI。

## 只索引正文

默认情况下，Pagefind 会把整页内容都索引进去，包括导航、页脚、侧边栏。结果就是搜「RSS」，每一页都能命中。

给正文容器加上 `data-pagefind-body`：

```html
<div class="prose" data-pagefind-body>
  <!-- 文章内容 -->
</div>
```

只要站点里出现过这个属性，Pagefind 就只索引带这个属性的区域，没有这个属性的页面会被整页跳过。首页、归档页、标签页这些列表页因此不会进索引，搜索结果只指向文章本身。

目录、摘要卡这类文章页里的辅助区块，再用 `data-pagefind-ignore` 单独排除。

## 中文检索

Pagefind 会从 `<html lang="zh-CN">` 识别出中文。构建时会看到一条提示：

```text
Note: Pagefind doesn't support stemming for the language zh-cn.
Search will still work, but will not match across root words.
```

「stemming」是指把 running、ran 归到 run 这种词形还原，对中文本来就不适用。实测搜「第一篇」这样的中文短语能正确命中，这条提示可以忽略。

## 两个细节

**开发模式下没有索引。** 索引是 `astro build` 之后才生成的，`npm run dev` 时 `/pagefind/` 目录并不存在。我的做法是在搜索页里判断 `import.meta.env.DEV`，开发模式下显示一行提示，告诉自己要 `npm run build && npm run preview` 才能测搜索，而不是渲染一个报错的空组件。

**搜索框默认限宽 480px。** 放进一个宽卡片里，输入框只占了一半。直接覆盖 `.pf-searchbox` 的 `max-width` 没有生效，看了它的 CSS 才发现，组件公开了一个变量专门控制这个宽度：

```css
.search-card {
  --pf-searchbox-max-width: 100%;
}
```

能用组件公开的变量就别硬覆盖内部类名。前者是它承诺的接口，后者随时可能在升级后失效。

## 小结

对静态博客来说，Pagefind 几乎是零成本的全文搜索：一个 devDependency，一行构建命令，一个 Web Component。没有 API Key，没有第三方服务，没有额外的服务器。
