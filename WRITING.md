# 写作操作手册

stormaker.dev 的日常写作、修改、发布流程。技术架构和部署细节见 [README](./README.md)。

> **一句话版本**：在 `src/content/blog/` 里写一个 `.md` 文件，`git push` 到 `astro-blog` 分支，约 1 分钟后上线。

---

## 目录

1. [第一次准备](#1-第一次准备)
2. [新增一篇文章](#2-新增一篇文章)
3. [Frontmatter 字段说明](#3-frontmatter-字段说明)
4. [正文写法](#4-正文写法)
5. [草稿](#5-草稿)
6. [修改已发布的文章](#6-修改已发布的文章)
7. [下线或删除文章](#7-下线或删除文章)
8. [发布与确认上线](#8-发布与确认上线)
9. [回滚](#9-回滚)
10. [修改站点文案](#10-修改站点文案)
11. [常见问题](#11-常见问题)
12. [速查表](#12-速查表)

---

## 1. 第一次准备

只在新电脑上需要做一次。

```bash
# 需要 Node 22.12 以上（仓库 .nvmrc 指定 24）
node -v

git clone https://github.com/stormaker/stormaker.dev.git
cd stormaker.dev
git checkout astro-blog   # ⚠️ 博客在这个分支，不是 main
npm install
```

> **为什么不是 `main`？** 仓库的 `main` 上是一个旧的 Next.js 项目。Cloudflare 的生产分支指向 `astro-blog`。往 `main` 推送不会更新博客。

---

## 2. 新增一篇文章

### 第 1 步：建文件

在 `src/content/blog/` 下新建一个 `.md` 文件。**文件名就是网址**：

```
src/content/blog/my-new-post.md   →   https://stormaker.dev/blog/my-new-post/
```

文件名的规则：

- 用英文小写字母、数字和连字符，比如 `cloudflare-d1-counter.md`
- 不要用中文、空格或大写字母
- 定下来就别改（原因见[第 6 节](#6-修改已发布的文章)）

### 第 2 步：写内容

```markdown
---
title: '文章标题'
description: '一两句话的摘要，会显示在文章开头的摘要卡里。'
pubDate: 2026-09-22
tags: ['Cloudflare', '前端']
draft: true
---

开头一段引子，说清楚这篇要解决什么问题。

## 第一节

正文……

### 一个小节

正文……

## 小结

正文……
```

建议先带着 `draft: true` 写，写完再去掉（见[第 5 节](#5-草稿)）。

### 第 3 步：本地预览

```bash
npm run dev
```

浏览器打开 http://localhost:4321/blog/my-new-post/ 。每次保存文件，页面都会自动刷新。

### 第 4 步：发布

删掉 `draft: true` 这一行，然后：

```bash
git add .
git commit -m "post: 文章标题"
git push
```

约 1 分钟后上线。怎么确认，见[第 8 节](#8-发布与确认上线)。

---

## 3. Frontmatter 字段说明

Frontmatter 是文件开头两行 `---` 之间的部分。

| 字段 | 必填 | 格式 | 作用 |
| --- | --- | --- | --- |
| `title` | ✅ | 字符串 | 文章标题。显示在页面、列表、RSS 和浏览器标签上 |
| `description` | ✅ | 字符串 | 摘要。显示在文章开头的 **TL;DR 摘要卡**、首页和归档列表、搜索引擎结果和社交分享卡片上 |
| `pubDate` | ✅ | `2026-09-22` | 发布日期，决定文章的排列顺序 |
| `tags` | | `['标签A', '标签B']` | 标签。第一个标签还会出现在面包屑里 |
| `draft` | | `true` / `false` | `true` 表示草稿：只在本地可见，线上完全不存在 |
| `updatedDate` | | `2026-09-30` | 最后更新日期。填了之后，页面上会显示「更新于」 |
| `heroImage` | | `'../../assets/xxx.jpg'` | 头图，显示在标题下方，也会作为社交分享卡片的图片 |

**同一天发多篇时**，可以带上时间来控制先后顺序：

```yaml
pubDate: 2026-09-22T20:00:00+08:00
```

**写 `description` 的建议**：一两句话讲清「这篇解决什么问题、得出什么结论」，控制在 80 字以内。它是读者在列表里决定点不点进来的依据。

**标签的建议**：先看 [/tags/](https://stormaker.dev/tags/) 里已有哪些标签，尽量复用。`Cloudflare` 和 `cloudflare` 会被当成两个不同的标签。

---

## 4. 正文写法

### 标题与目录

| 写法 | 效果 |
| --- | --- |
| `## 标题` | 章节标题，左侧有竖条；进入目录，编号 01、02…… |
| `### 标题` | 小节标题；进入目录，缩进挂在所属章节下 |
| `#### 标题` | 更小的标题；**不进目录** |

- **不要用 `#`**。一级标题就是 frontmatter 里的 `title`，重复写会出现两个大标题。
- 目录是根据 `##` 和 `###` 自动生成的，不需要手写。
- 一篇文章里如果既没有 `##` 也没有 `###`，左侧就不显示目录。

### 代码

用三个反引号包住，并标上语言，就会有语法高亮：

````markdown
```ts
const hello = (name: string) => `hello, ${name}`;
```
````

常用的语言标记：`ts`、`js`、`bash`、`json`、`jsonc`、`css`、`html`、`astro`、`python`、`sql`、`yaml`、`text`。其中 `text` 表示纯文本，适合贴报错信息。

行内代码用单个反引号：`` `npm run dev` ``。

### 图片

图片放在 `src/assets/` 目录下，在正文里用相对路径引用：

```markdown
![图片说明](../../assets/my-screenshot.png)
```

- 构建时会自动压缩并转成 webp，直接放原图就行。
- 方括号里的「图片说明」不要省略。它是图片加载失败时显示的文字，也方便读屏软件朗读。
- 图片多的文章，可以在 assets 下建子目录，比如 `src/assets/d1-counter/`，路径相应改成 `../../assets/d1-counter/xxx.png`。

### 其他常用格式

```markdown
**加粗**   *斜体*   [链接文字](https://example.com)

> 引用块：适合放重要提醒或别人的原话

- 无序列表
1. 有序列表

| 表头 | 表头 |
| --- | --- |
| 内容 | 内容 |

---
```

最后一行的 `---` 会渲染成一道波浪分割线。**它的前后都要空一行**，否则会被当成上一段文字的标题标记。

### 需要组件时用 `.mdx`

如果要在文章里嵌入交互组件，把扩展名改成 `.mdx`，就能在正文里 `import` Astro 组件。纯文字文章用 `.md` 就够了。

---

## 5. 草稿

在 frontmatter 里加上 `draft: true`：

| | 本地 `npm run dev` | 线上 |
| --- | --- | --- |
| 文章页 | ✅ 可以访问，标题旁会显示「草稿」标记 | ❌ 不存在，访问返回 404 |
| 首页、归档列表 | ✅ 显示，带「草稿」标记 | ❌ 不显示 |
| RSS、sitemap、搜索 | — | ❌ 都不包含 |
| 标签计数 | — | ❌ 不计入 |

所以写到一半的文章**可以放心提交进仓库**，既不会丢，也不会被读者看到。

目前仓库里有这几篇草稿：

- `d1-view-counter.md`：只有大纲
- `git-workflow.md`：只有大纲
- `markdown-style-guide.md`：模板自带的排版示例，留在本地检查样式用

---

## 6. 修改已发布的文章

直接编辑对应的 `.md` 文件，然后 commit、push，和发布新文章一样。

**内容有实质改动时**，加上更新日期：

```yaml
updatedDate: 2026-09-30
```

页面上会显示「更新于 2026-09-30」。改个错别字这种小修改不需要加。

**⚠️ 不要改文件名。** 文件名就是网址，改了之后：

- 旧链接会变成 404，包括别人收藏的书签和其他网站引用的链接
- RSS 阅读器会把它当成一篇新文章，再推送一次

标题（`title`）可以随便改，它不影响网址。

---

## 7. 下线或删除文章

| 做法 | 效果 | 适合的场景 |
| --- | --- | --- |
| 加上 `draft: true` | 线上消失，文件保留，随时可以恢复 | 暂时下线、要大改之后再发 |
| 删除 `.md` 文件 | 线上消失，文件也没了（git 历史里还在） | 确定不要了 |

两种做法都会让原网址变成 404。

---

## 8. 发布与确认上线

`git push` 之后，Cloudflare 会自动执行 `npm run build` 和部署，整个过程约 1 分钟。

**确认已经上线**，任选一种：

- 直接访问文章网址。如果看到旧内容，强制刷新一下（Mac 上按 `Cmd + Shift + R`）
- 在 Cloudflare Dashboard → Workers & Pages → `stormaker-dev` → **Deployments** 里，看最新一次构建是不是绿色的对勾

**构建失败时**，线上会继续显示上一个成功的版本，**不会挂掉**。在上面的 Deployments 页面点开那次失败的构建，可以看到日志。

**推荐的习惯：push 之前先在本地构建一次**。有错误会直接报出来，不用等到 Cloudflare 那边才发现：

```bash
npm run build
```

---

## 9. 回滚

发布了有问题的内容，想马上恢复到上一个版本时，有两种办法：

**办法 A：在 Cloudflare 上回滚（最快，几秒钟生效）**

Dashboard → `stormaker-dev` → Deployments → Version History。点开上一个正常版本右侧的 `···` 菜单，选择回滚（Rollback）。Cloudflare 会保留最近 100 个版本。

这种办法只改线上，不改代码。下次 push 时，线上又会变成最新代码的样子，所以之后还要把代码也改好。

**办法 B：用 git 撤销提交（彻底）**

```bash
git log --oneline -5          # 找到出问题的那次提交
git revert <提交号>             # 生成一个反向提交，不改写历史
git push
```

---

## 10. 修改站点文案

| 想改什么 | 改哪个文件 | 改哪里 |
| --- | --- | --- |
| 站点名称 | `src/consts.ts` | `SITE_TITLE` |
| 首页简介，同时也是站点描述 | `src/consts.ts` | `SITE_DESCRIPTION` |
| 首页潮汐卡上的「最近在写」 | `src/consts.ts` | `NOW_WRITING` |
| GitHub、邮箱等社交链接 | `src/consts.ts` | `SOCIAL`，留空字符串就不显示 |
| 导航栏菜单 | `src/consts.ts` | `NAV_LINKS` |
| 首页大标题「迎着风暴，造点东西」 | `src/pages/index.astro` | `<h1>` 那一行 |
| 关于页 | `src/pages/about.astro` | 正文部分 |
| 页脚那句英文 | `src/components/Footer.astro` | `class="serif"` 那一行 |

首页大标题里被 `<mark class="wave">…</mark>` 包住的文字，下面会有一道冰川蓝的波浪荧光笔。

首页潮汐卡上的文章数、标签数和天数，都是根据文章自动算出来的，不需要手动改。

---

## 11. 常见问题

**Q：本地 `/search` 页面没有搜索框？**
正常现象。搜索索引要构建之后才会生成。要测搜索，运行：

```bash
npm run build && npm run preview
```

然后打开 http://localhost:4321/search/ 。

**Q：push 之后线上没变化？**

1. 确认你推送的是 `astro-blog` 分支：运行 `git branch`，前面带 `*` 的是当前分支
2. 确认文章里没有 `draft: true`
3. 到 Cloudflare 的 Deployments 页面看构建是不是失败了
4. 强制刷新浏览器

**Q：构建失败，日志里写着 frontmatter 相关的错误？**
最常见的几个原因：

- 漏了 `title`、`description` 或 `pubDate` 中的某一项
- 日期格式不对。要写 `2026-09-22`，不能写 `2026/9/22`
- 标题里有英文冒号，却没有用引号包起来。**建议所有字符串都用单引号包住**
- `tags` 没有写成数组的形式：要写 `['A', 'B']`，不能写 `A, B`

**Q：把 `pubDate` 设成未来的日期，文章会等到那天才发布吗？**
不会。只要没有标记 `draft: true`，push 之后就会立刻上线，只是显示的日期是未来的那一天。想定时发布，要等到当天再去掉 `draft: true` 并 push。

**Q：没带电脑，能发文章吗？**
可以。在 GitHub 网页上打开仓库，切换到 `astro-blog` 分支，进入 `src/content/blog/`：

- 新建文章：点 **Add file → Create new file**
- 修改文章：打开文件后点铅笔图标

提交之后同样会自动构建上线。不过这样没法在本地预览，建议只做小修改，或者先带着 `draft: true` 提交。

---

## 12. 速查表

```bash
# ── 写作 ──────────────────────────────
npm run dev                          # 本地预览 http://localhost:4321

# ── 发布 ──────────────────────────────
npm run build                        # （可选）先在本地确认能构建成功
git add .
git commit -m "post: 文章标题"         # 新文章
git commit -m "fix: 修改某篇的某处"     # 修改
git push                             # 约 1 分钟后上线

# ── 检查 ──────────────────────────────
npm run build && npm run preview     # 本地看完整效果，包括搜索
npm run check                        # 类型检查
git branch                           # 确认在 astro-blog 分支上
```

新文章模板：

```markdown
---
title: ''
description: ''
pubDate: 2026-09-22
tags: []
draft: true
---

## 

```
