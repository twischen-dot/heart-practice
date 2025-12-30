# HEART 对话演练系统 - MVP版

基于AI的HEART对话技巧训练平台，帮助用户通过结构化演练提升沟通能力。

## 功能特性

- ✅ 场景智能提取
- ✅ HEART五步对话流程（H-E-A-R-T）
- ✅ 实时教练提示
- ✅ 过关判定机制
- ✅ 结构化复盘报告
- ✅ 导出图片功能

## 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS
- Zustand (状态管理)
- React Router
- Axios
- html2canvas

### 后端
- Node.js + Express
- Claude API (Anthropic)
- CORS

## 快速开始

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 2. 配置环境变量

在 `backend` 目录创建 `.env` 文件：

```env
ANTHROPIC_API_KEY=your_claude_api_key_here
PORT=3001
```

### 3. 启动服务

```bash
# 启动后端 (终端1)
cd backend
node index.js

# 启动前端 (终端2)
cd frontend
npm start
```

前端访问: http://localhost:3000
后端API: http://localhost:3001

## 使用流程

1. **场景输入**: 描述你想练习的沟通场景
2. **开始演练**: 系统提取场景要素，进入HEART五步演练
3. **对话交互**: 与AI对话，获得实时教练提示和建议话术
4. **查看复盘**: 演练结束后查看评分和改进建议
5. **导出报告**: 将复盘报告导出为图片

## HEART 五步法

- **H (Hear)**: 倾听并复述对方观点
- **E (Empathy)**: 表达共情，理解感受
- **A (Ask)**: 提出开放式问题
- **R (Respond)**: 提出具体行动方案
- **T (Track)**: 明确时间节点和检查点

## 项目结构

```
heart-practice/
├── backend/
│   ├── api/           # API路由
│   ├── prompts/       # LLM提示词模板
│   ├── utils/         # 工具函数
│   └── index.js       # 入口文件
├── frontend/
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   ├── components/# 可复用组件
│   │   ├── store/     # 状态管理
│   │   ├── services/  # API服务
│   │   └── types/     # TypeScript类型
│   └── package.json
└── README.md
```

## API 接口

### 场景提取
```
POST /api/scene/extract
Body: { description: string }
Response: Scene对象
```

### 发送消息
```
POST /api/chat/message
Body: { step, scene, userMessage, history }
Response: CoachResponse对象
```

### 生成复盘
```
POST /api/review/generate
Body: { scene, conversation }
Response: Review对象
```

## 开发计划

- [x] 项目初始化
- [x] 后端API开发
- [x] 前端页面开发
- [x] HEART状态机
- [x] 过关判定
- [x] 复盘报告
- [ ] 部署上线
- [ ] 性能优化
- [ ] 用户测试

## 成本估算

- Claude API: ~$5-10/月 (测试+演示)
- 部署: 免费 (Vercel)

## 许可证

MIT

## 联系方式

如有问题或建议，请提交Issue。
