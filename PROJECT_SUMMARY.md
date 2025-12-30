# HEART对话演练系统 - 项目交付文档

## 项目概述

已完成HEART对话演练系统的MVP版本开发，这是一个基于AI的沟通技巧训练平台。

## 已完成功能

### 后端 (Node.js + Express)
✅ **API服务**
- 场景提取接口 (`/api/scene/extract`)
- 对话交互接口 (`/api/chat/message`)
- 复盘生成接口 (`/api/review/generate`)

✅ **核心逻辑**
- HEART五步状态机
- 过关判定规则（关键词+长度检查）
- Claude API集成
- 结构化Prompt模板

### 前端 (React + TypeScript)
✅ **页面**
- 场景输入页 - 用户描述沟通场景
- 演练页 - HEART五步对话交互
- 复盘页 - 评分报告和改进建议

✅ **功能**
- Tailwind CSS样式
- Zustand状态管理
- React Router路由
- 实时教练提示
- 可点用话术
- 导出图片功能

## 技术架构

```
┌─────────────┐      HTTP      ┌─────────────┐      API      ┌─────────────┐
│   Browser   │ ◄──────────────► │   Express   │ ◄────────────► │  Claude API │
│  (React)    │                 │   Server    │               │  (Anthropic)│
└─────────────┘                 └─────────────┘               └─────────────┘
```

## 项目结构

```
heart-practice/
├── backend/
│   ├── api/
│   │   ├── scene.js      # 场景提取
│   │   ├── chat.js       # 对话交互
│   │   └── review.js     # 复盘生成
│   ├── prompts/
│   │   ├── scene.js      # 场景提取Prompt
│   │   └── chat.js       # 对话Prompt
│   ├── utils/
│   │   ├── claude.js     # Claude API封装
│   │   └── heart.js      # HEART状态机
│   ├── index.js          # 服务入口
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SceneInput.tsx
│   │   │   ├── Practice.tsx
│   │   │   └── Review.tsx
│   │   ├── store/
│   │   │   └── index.ts  # Zustand store
│   │   ├── services/
│   │   │   └── api.ts    # API调用
│   │   ├── types/
│   │   │   └── index.ts  # TypeScript类型
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 启动步骤

### 1. 配置环境变量

在 `backend/.env` 文件中配置：
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3001
```

### 2. 安装依赖

```bash
# 后端
cd backend && npm install

# 前端
cd frontend && npm install
```

### 3. 启动服务

```bash
# 终端1 - 启动后端
cd backend && npm start

# 终端2 - 启动前端
cd frontend && npm start
```

访问: http://localhost:3000

## 核心功能演示

### 1. 场景输入
用户输入场景描述 → AI提取关键要素（角色、问题、目标、约束）

### 2. HEART演练
- **H步**: 倾听复述 - 检查关键词（听到、了解、你说的是）
- **E步**: 共情表达 - 检查关键词（理解、感受、能想象）
- **A步**: 提问澄清 - 检查疑问句
- **R步**: 回应方案 - 检查行动词汇
- **T步**: 追踪落实 - 检查时间节点

### 3. 实时反馈
- 对方回复（AI扮演）
- 教练提示（2条建议）
- 可点用话术（3条示例）
- 过关判定（达标/未达标）

### 4. 复盘报告
- HEART五项评分（0-100）
- 亮点总结
- 改进建议（3条）
- 行动计划
- 导出图片

## 技术亮点

1. **状态机设计**: 严格控制HEART流程，确保步骤完整性
2. **双通道输出**: AI同时扮演对方+教练，分离展示
3. **过关机制**: 规则判定+LLM评估，快速反馈
4. **结构化Prompt**: JSON格式输出，确保稳定性
5. **响应式UI**: Tailwind CSS，适配不同屏幕

## 成本估算

- **开发成本**: 已完成（约2-3天工作量）
- **运行成本**:
  - Claude API: ~$0.01-0.05/次对话
  - 月度估算: $5-20（取决于使用量）
  - 部署: 免费（Vercel）

## 下一步建议

### 短期优化（1-2周）
- [ ] 添加加载动画和错误处理
- [ ] 优化Prompt提示词
- [ ] 添加示例场景模板
- [ ] 性能优化（缓存、防抖）

### 中期迭代（1个月）
- [ ] 用户账号系统
- [ ] 历史记录查看
- [ ] 多种对方人设
- [ ] 语音输入支持

### 长期规划（3个月）
- [ ] 微信小程序版本
- [ ] 企业版功能（团队管理、数据统计）
- [ ] 自定义场景模板
- [ ] 多语言支持

## 部署方案

### 推荐: Vercel (免费)

**后端部署**:
```bash
cd backend
vercel
```

**前端部署**:
```bash
cd frontend
npm run build
vercel
```

### 环境变量配置
在Vercel Dashboard中配置:
- `ANTHROPIC_API_KEY`
- `REACT_APP_API_URL` (前端)

## 测试场景示例

### 场景1: 绩效辅导
```
我是团队负责人，需要和下属小李沟通他最近的工作表现。
他是资深工程师，最近两个月交付延期，代码质量下降。
我希望了解原因并帮助他改进。
```

### 场景2: 跨部门协作
```
我是产品经理，需要和技术负责人沟通需求优先级问题。
他认为我们的需求变更太频繁，影响开发进度。
我需要说明业务压力，同时理解技术团队的困难。
```

### 场景3: 客户沟通
```
我是项目经理，需要向客户说明项目延期的情况。
客户对进度很不满意，威胁要终止合同。
我需要解释原因，提出补救方案，重建信任。
```

## 联系与支持

- 项目位置: `/Users/macmini/ZCodeProject/heart-practice`
- 文档: `README.md`
- 问题反馈: 提交Issue或联系开发团队

---

**项目状态**: ✅ MVP完成，可进行测试和演示
**交付日期**: 2025-12-29
**版本**: v1.0.0
