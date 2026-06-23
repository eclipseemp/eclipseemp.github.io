# 燕云十六声工具集

一个完整的燕云十六声游戏工具合集，包含伤害计算器、和鸣模拟器、武器重铸模拟器。

## 功能特性

### ⚔️ 伤害计算器
- **百万次模拟**：支持高性能伤害模拟计算
- **单次模拟**：1000次攻击直方图，统计命中/精准/会心/会意
- **30+基础属性**：攻击、会心、会意、穿透、增伤、属攻等完整属性系统
- **实时DPS分布**：直方图可视化伤害分布
- **配装方案管理**：保存、对比、分享配装方案
- **门派预设**：各门派推荐配装一键加载

### 🎴 和鸣模拟器
- 单抽 / 十连 / 五十连抽卡模拟
- 自动抽卡直到出金
- 抽卡历史记录与统计
- 保底机制模拟

### 🔨 武器重铸模拟器
- 武器重铸词条随机模拟
- 词条品质分级（蓝/紫/金）
- 锁定词条功能
- 保底机制与统计
- 重铸音效反馈

## 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- shadcn/ui 组件库
- Recharts 图表库
- Framer Motion 动画
- Sonner Toast

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## GitHub Pages 部署

项目已配置完整的 GitHub Pages 部署支持：

1. **base 路径配置**：`vite.config.ts` 中已配置 `base: '/yanhun-simulator/'`
2. **GitHub Actions 工作流**：`.github/workflows/deploy.yml` 自动部署

部署步骤：
1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 GitHub Actions 作为部署源
4. 推送到 main 分支自动触发部署

## 项目结构

```
yanhun-simulator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 部署工作流
├── src/
│   ├── components/             # UI组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   └── Layout.tsx          # 布局组件
│   ├── pages/
│   │   └── HomePage/           # 主页面（包含三个功能模块）
│   ├── types/                  # 类型定义
│   ├── data/                   # 游戏数据配置
│   ├── utils/                  # 工具函数
│   ├── app.tsx                 # 路由配置
│   ├── main.tsx                # 入口文件
│   └── tailwind-theme.css      # 主题配置
├── public/                     # 静态资源
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 承音数值标准

| 词条 | 满值 | 承音(94%) |
|------|------|----------|
| 大外/小外 | 105.6 | 99.3 |
| 敏/劲/势 | 66.8 | 62.8 |
| 会心率 | 12.3% | 11.6% |
| 精准率 | 10.8% | 10.2% |
| 会意率 | 6% | 5.6% |
| 属攻 | 59.8 | 56.2 |
| 武学增效 | 8.6% | 8.1% |
| 单体/群体 | 13.4% | 12.6% |
| 首领 | 4.4% | 4.1% |
| 全武学 | 4.2% | 3.9% |
| 外功穿透* | 14.6 | 14.6 |
| 无相穿透* | 15.6 | 15.6 |
| 指定武学定音* | 8% | 8% |

> *特殊词条：不乘94%，直接满值

## 在线访问

项目已部署上线：[燕云十六声工具集](https://4kdbwqyx0j6q6.aiforce.cloud/app/app_4kdd2gwse9kwa)
