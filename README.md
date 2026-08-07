# Gerald Leung 个人网站

这个仓库托管我的个人作品集网站：

[geraldleung95.github.io](https://geraldleung95.github.io/)

网站的核心定位是：从业务现场出发，识别真实问题，澄清决策逻辑，并把复杂业务问题转化为可运行的系统、可解释的模型或可交互的展示。

## 网站结构

- `index.html` - 首页，包含个人介绍、90 秒视频入口、四个案例入口和价值飞轮。
- `assets/` - 共用视觉资产、SVG 封面图、视频/海报和网页字体 subset。
- `demos/supply-cost/` - 供应链降本案例。
- `demos/overseas-handoff/` - 海外衔接协作案例和配套工具。
- `demos/inventory-control/` - 库存控制与仓储容量案例。
- `demos/eta-optimization/` - 预计到货日期优化案例，包含 3D Plotly 演示。
- `docs/` - 网站维护说明和版本记录。

## 案例集逻辑

首页用两条轴组织四类复杂业务问题的求解范式，四个案例来自供应链场景中的真实实践：

- 问题结构：分解 vs. 耦合。
- 求解方式：解释 vs. 推演。

四个案例分别代表不同类型的问题处理方式：

- **供应链降本**：把年度降本目标拆到费用、动作与指标，形成可观察、可归因的降本路径。
- **海外衔接**：围绕同一事实底表，让多角色识别风险、判断责任并协同推进。
- **库存控制**：用时序推演预判发货缺口与仓租压力，再转化为库存决策依据。
- **预计到货日期优化**：把一个预计到货日期字段背后的采购、供应商、物流、仓库与计划冲突，识别成可建模、可计算、可解释的运筹学问题。

## 技术说明

这个网站保持为静态站点，便于长期维护和 GitHub Pages 发布：

- 原生 HTML / CSS / JavaScript。
- 首页案例封面使用 SVG。
- 预计到货日期案例中的 3D 演示以静态 HTML 方式内嵌 Plotly。
- 中文字体使用 LXGW WenKai 的 WOFF2 subset，避免提交完整大字体文件。
- 发布由 `.github/workflows/pages.yml` 中的 GitHub Pages workflow 完成。

## 发布说明

`main` 分支推送后，会通过 `Deploy GitHub Pages` workflow 发布到线上。

提交前应避免把本地预览和自动化产物带入仓库：

- `.playwright-cli/`
- `output/`
- 本地截图、浏览器 profile 和临时预览 HTML

维护细节见 [docs/site-maintenance.md](docs/site-maintenance.md)。
