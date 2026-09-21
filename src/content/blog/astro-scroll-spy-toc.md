---
title: '在 Astro 里做一个会跟随阅读位置的目录'
description: '用 render() 返回的 headings 生成目录，再用几十行原生 JS 做 scroll-spy：当前章节高亮，读到小节时所属的大节也同步点亮。'
pubDate: 2026-09-21T23:00:00+08:00
tags: ['Astro', '前端']
---

长文章配一个固定在侧边、会跟着阅读位置高亮的目录，读者随时知道自己读到哪了，也能一眼看出全文结构。这篇记录博客文章页左侧那个「水深标尺」目录是怎么做的。

## 数据：headings 是现成的

Astro 渲染内容集合里的文章时，`render()` 除了返回 `Content` 组件，还会返回文章里所有标题：

```astro
---
const { Content, headings } = await render(post);
---
```

每一项是 `{ depth, slug, text }`，`slug` 就是标题渲染出来的 `id`，可以直接拿来做锚点。同名标题（比如好几节都叫「示例」）会被自动加上 `-1`、`-2` 后缀，不会冲突。

目录只取 h2 和 h3。h2 编号成 01、02……，h3 缩进挂在所属 h2 下面：

```ts
let n = 0;
const toc = headings
  .filter((h) => h.depth === 2 || h.depth === 3)
  .map((h) => ({ ...h, n: h.depth === 2 ? String(++n).padStart(2, '0') : null }));
```

## 定位：sticky 就够了

目录固定在侧边，不需要 JS，一行 `position: sticky` 就行：

```css
.toc {
  position: sticky;
  top: 96px; /* 让出吸顶导航的高度 */
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
```

点击目录跳转时，标题会被吸顶导航挡住。给标题加 `scroll-margin-top` 解决：

```css
.prose h2,
.prose h3 {
  scroll-margin-top: 96px;
}
```

## 高亮：当前章节怎么算

scroll-spy 的核心问题是：此刻读者在读哪一节？

常见做法是用 `IntersectionObserver` 看哪个标题进入了视口。但它有个边界情况：两个标题之间隔着很长的正文时，读到中间，视口里一个标题都没有，高亮就不知道该停在哪。

我用了一个更简单的规则：**当前章节 = 最后一个越过视口上方 1/3 线的标题。**

```ts
const line = innerHeight / 3;
let cur = heads[0];
for (const h of heads) {
  if (h.getBoundingClientRect().top < line) cur = h;
}
```

标题一旦滚过这条线，就一直是「当前」，直到下一个标题也滚过来。不管两个标题之间隔多远，任何时刻都恰好有一个章节处于高亮状态。

滚动事件触发得很频繁，用 `requestAnimationFrame` 节流，每帧最多算一次：

```ts
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateToc();
    ticking = false;
  });
}, { passive: true });
```

## 细节：读到小节时，大节也要亮

只高亮当前的 h3 还不够。目录很长时，读者看到高亮在某个小节上，却要往上找才知道它属于哪一大节。

所以读到 h3 时，所属的 h2 也加一个 `within` 状态：

```ts
let parent = null;
for (const h of heads) {
  if (h.tagName === 'H2') parent = h;
  if (h === cur) break;
}
// cur 是 h3 时，parent 就是它所属的 h2
```

视觉上，`active` 是实心的圆点加粗体字，`within` 只把编号和圆点描成主色。两层状态一强一弱，读者能同时看清「在哪一大节」和「具体在哪一小节」。

## 小屏：折叠成下拉

屏幕宽度不够放两栏时，侧边目录隐藏，换成正文顶部的一个 `<details>`：

```html
<details class="toc-mobile">
  <summary>目录 · 5 节</summary>
  <ol>…</ol>
</details>
```

原生 `<details>` 自带展开收起和键盘支持，不需要任何 JS。小屏上只列 h2，保持简短。

## 小结

整个目录的数据来自 Astro 现成的 `headings`，定位靠 CSS `sticky`，高亮靠一条「1/3 线」规则加 rAF 节流，小屏靠原生 `<details>`。没有引入任何依赖，客户端 JS 只有几十行。
