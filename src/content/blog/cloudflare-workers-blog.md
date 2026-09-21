---
title: '把博客搬到 Cloudflare Workers：一次零成本的 Serverless 实践'
description: '从选型、DNS 迁移到 push 即上线，记录一个静态博客在 Workers 静态资源模式下的完整落地过程。全程零成本，一个下午完成。'
pubDate: 2026-09-21T20:00:00+08:00
tags: ['Cloudflare', 'Serverless', 'Astro']
---

域名 `stormaker.dev` 一直躺在 Cloudflare 上吃灰。这次终于把博客搭起来了：Astro 生成静态页面，Cloudflare 托管，push 到 GitHub 自动上线。整个过程不花一分钱，但中间踩了几个坑，记下来。

## 为什么选 Workers 而不是 Pages

最早的候选是 GitHub Pages 和 Cloudflare Pages。GitHub Pages 最先排除：域名在 Cloudflare，托管却在 GitHub，DNS 要指出去、证书要等它签，而且它只能放纯静态文件，以后想加一个接口都没地方写。

Cloudflare 这边有 Pages 和 Workers 两条路。现在官方把新项目引导到 **Workers 的静态资源模式**，对纯静态站来说体验和 Pages 几乎一样：

- 不需要写任何 Worker 代码，Cloudflare 直接从构建产物目录提供文件
- 以后要加 API（浏览量、订阅表单之类），只需要在配置里补一个 `main` 入口和 KV / D1 绑定，不用换平台
- 免费额度对个人博客约等于无限，纯静态资源请求甚至不计费

配置文件就这么几行：

```jsonc
// wrangler.jsonc
{
  "name": "stormaker-dev",
  "compatibility_date": "2026-09-21",
  "assets": {
    "directory": "./dist",
    // 找不到路径时返回构建出来的 404.html，而不是 Cloudflare 的默认页
    "not_found_handling": "404-page"
  }
}
```

## DNS：先看清楚再删

第一次 `wrangler deploy` 时，文件上传成功了，绑定域名却失败了：

```text
Hostname 'stormaker.dev' already has externally managed DNS records
(A, CNAME, etc). Delete them first or try a different hostname. [code: 100117]
```

原来根域和 `www` 上还挂着几条很早以前的记录，指向一台旧服务器。那台服务器在这几个域名上早就不提供内容了，访问全是 404，但记录一直没清理。

### 删除前先存档

DNS 记录删起来只要点一下，但删之前要想清楚两件事：

1. **有没有别的东西依赖这个名字。** 我翻了本地项目、GitHub 上的代码和 SSH 配置，确认没有任何地方引用这些域名。SSH 配置里直接写的是 IP，不受影响。
2. **CNAME 链会不会断。** 有一条子域是 CNAME 到另一条待删记录的，如果只删被指向的那条，它就变成悬空记录。所以要成组删。

删之前把每条记录的类型、名称、值都存了一份文本快照，万一要恢复，照着加回去就行。

> 删 DNS 只是让名字不再解析，服务器本身照常运行、照常计费。要停机器得去云厂商控制台单独操作。

### custom_domain 自动绑定

清掉冲突记录后，绑定域名不需要去 Dashboard 手点。在 `wrangler.jsonc` 里声明路由，加上 `custom_domain: true`，部署时 Cloudflare 会自动创建 DNS 记录并签发证书：

```jsonc
{
  "routes": [
    { "pattern": "stormaker.dev", "custom_domain": true },
    { "pattern": "www.stormaker.dev", "custom_domain": true }
  ]
}
```

这样域名配置就和代码放在一起了，每次部署都会带上，不会出现「Dashboard 里改过但没人记得」的状态。

## 构建与自动部署

手动 `wrangler deploy` 能用，但写博客的理想状态是：写完 Markdown，`git push`，就结束了。

Workers 自带构建服务（Workers Builds）。在 Worker 的 Settings → Builds 里连接 GitHub 仓库，填三项：

| 配置项 | 值 |
| --- | --- |
| 生产分支 | `astro-blog` |
| 构建命令 | `npm run build` |
| 部署命令 | `npx wrangler deploy` |

连接 GitHub 时需要在 GitHub 上安装 Cloudflare 的 App。权限我只给了这一个仓库，没有给整个账号。

配好之后推了一个空提交测试：约一分钟后新版本自动成为线上版本。之后每次推送到生产分支都会自动构建上线，推到其他分支只会上传预览版本，不影响线上。

## 三个踩过的坑

1. **连接 GitHub 后，生产分支默认是 `main`。** 我的博客在 `astro-blog` 分支，仓库的 `main` 上是一个旧项目。如果没注意到这一点，下次有人往 `main` 推代码，旧项目就会被构建出来覆盖博客。连接完一定要回头检查这个字段。
2. **wrangler 的 OAuth 授权没有 DNS 权限。** `wrangler login` 拿到的 token 能部署 Worker、能绑自定义域，但读写不了 DNS 记录。所以清理冲突记录这一步只能去 Dashboard 做。
3. **本机代理会截走登录回调。** `wrangler login` 的 OAuth 回调走 `localhost:8976`，第一次登录一直超时。如果本机开着全局代理或 TUN 模式，这个回调可能被代理吃掉。重新登录一次，并确认代理对本地地址直连，就好了。

## 小结

最终的工作流：

```bash
# 写完文章
git add . && git commit -m "post: 标题" && git push
# 约一分钟后，stormaker.dev 上线
```

零服务器、零费用，域名、DNS、证书、构建、托管都在同一个平台上。静态站用 Workers 的静态资源模式托管，以后要长出一点后端能力时，也不用搬家。
