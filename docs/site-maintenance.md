# 网站维护说明

这份文档记录个人网站工程的维护、预览和发布规则。

## 发布流程

1. 只修改正式站点文件，例如 `index.html`、`assets/`、`demos/` 或已纳入版本管理的 `docs/`。
2. 涉及链接、嵌套页面或静态资源时，先用本地静态服务验证。
3. 提交前运行 `git status --short`，确认没有混入临时文件。
4. 只暂存本次要发布的正式文件。
5. 提交并推送到 `main`。
6. 优先检查 `Deploy GitHub Pages` workflow，而不是只看 GitHub 内置 Pages run。
7. workflow 成功后，直接访问线上 URL 验证页面和资源。

本地静态服务命令：

```powershell
python -m http.server 8768 --bind 127.0.0.1
```

访问：

```text
http://127.0.0.1:8768/
```

## 部署工作流

当前使用的发布 workflow：

```text
.github/workflows/pages.yml
```

它使用 GitHub 官方 Pages Actions，并设置了更长的 deploy timeout。这样可以规避之前内置 Pages 部署长时间 queued 或超时失败的问题。

推送后重点验证：

- `https://geraldleung95.github.io/`
- 新增或修改的 demo 页面
- 新增或修改的 SVG、视频、字体等静态资源
- HTML 中是否引用了正确的资源版本号

## 静态资源版本号

替换可能被浏览器缓存的静态资源时，应同步更新 HTML 中的查询版本号：

```html
assets/example.svg?v=YYYYMMDD
```

共享字体 subset 也使用同样方式：

```html
assets/fonts/LXGWWenKai-Gerald-subset.woff2?v=YYYYMMDD
```

## 字体 subset

网站使用：

```text
assets/fonts/LXGWWenKai-Gerald-subset.woff2
```

不要提交完整的 `LXGWWenKai-Medium.ttf`。完整字体文件过大，不适合这个静态网站，也曾增加 GitHub Pages 部署压力。

当正式页面新增较多中文文案时，应基于源 TTF 重新生成 WOFF2 subset，并更新正式页面中的字体版本号。

建议验证：

- subset 文件仍保持较小体积。
- 正式页面不再引用已删除的完整 TTF fallback。
- 普通中文正文不再明显 fallback 到系统字体。

## 本地临时产物

以下内容只用于本地预览和调试，不应提交：

- `output/`
- `.playwright-cli/`
- 临时截图
- 浏览器 profile
- 一次性预览 HTML
- 未准备公开发布的数据导出

这些内容对视觉迭代有用，但不属于公开 GitHub Pages artifact。

## 案例页原则

公开案例页应遵守以下边界：

- 聚焦业务问题、方法和交付物。
- 不写内部共享盘路径。
- 不暴露原始业务数据。
- 不在页面上堆叠过多实现细节。
- 仓库级说明放在 README 或 docs 中，不用页面里的长期辅助文案承载。

## 当前公开内容

- 首页个人介绍与 90 秒视频入口。
- 四个案例组成的作品集矩阵。
- 供应链降本案例。
- 海外衔接协作案例和配套工具。
- 库存控制案例。
- 预计到货日期优化案例和 Plotly 演示。
- 价值飞轮部分。
