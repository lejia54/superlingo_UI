lejia-demo-front/
├── node_modules/             # 项目依赖包目录
├── public/                   # 静态资源目录（如 favicon.ico 等）
├── src/                      # 源码核心目录
│   ├── api.ts                # 网络请求封装（对接后端 /api/v1/scan/{barcode}）
│   ├── types.ts              # TypeScript 类型定义与接口契约
│   ├── App.vue               # 主应用入口（全局状态、视图切换与 fade 动画）
│   ├── Scanner.vue           # 扫码模块组件（集成 html5-qrcode 与相册识别）
│   ├── ProductDetail.vue     # 详情页组件（包含卡片流、Nova 动态标签、正则进度条等）
│   ├── main.ts               # Vue 实例挂载入口
│   └── style.css             # 全局基础样式重置
├── index.html                # HTML 模板入口（移动端适配视口配置）
├── package.json              # 项目依赖声明（Vue、Vant、html5-qrcode等）
├── tsconfig.json             # TypeScript 编译器配置文件
└── vite.config.ts            # Vite 构建工具配置文件