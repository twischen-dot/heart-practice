# HEART 对话演练系统 - 部署指南

## 部署方案

**前端：** Cloudflare Pages
**后端：** Render.com

## 步骤 1：部署后端到 Render

### 1.1 准备 Git 仓库

```bash
cd /Users/macmini/ZCodeProject/heart-practice
git init
git add .
git commit -m "Initial commit"
```

### 1.2 推送到 GitHub

1. 在 GitHub 创建新仓库：`heart-practice`
2. 推送代码：
```bash
git remote add origin https://github.com/YOUR_USERNAME/heart-practice.git
git push -u origin main
```

### 1.3 在 Render 部署

1. 访问 https://render.com
2. 点击 "New +" → "Web Service"
3. 连接 GitHub 仓库
4. 配置：
   - **Name:** heart-practice-api
   - **Root Directory:** backend
   - **Build Command:** npm install
   - **Start Command:** node index.js
   - **Environment Variables:**
     ```
     ANTHROPIC_API_KEY=sk-ca284d066d1d4b1d90defb12f585f9ef
     ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
     ANTHROPIC_MODEL=deepseek-chat
     PORT=3001
     ```

5. 点击 "Create Web Service"
6. 等待部署完成，记录 URL（例如：https://heart-practice-api.onrender.com）

## 步骤 2：配置前端环境变量

### 2.1 创建生产环境配置

```bash
cd frontend
```

创建 `.env.production` 文件：
```
REACT_APP_API_URL=https://heart-practice-api.onrender.com
```

### 2.2 更新 API 服务

修改 `frontend/src/services/api.ts`，使用环境变量：
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

## 步骤 3：部署前端到 Cloudflare Pages

### 3.1 构建前端

```bash
cd frontend
npm run build
```

### 3.2 在 Cloudflare Pages 部署

1. 访问 https://pages.cloudflare.com
2. 点击 "Create a project"
3. 连接 GitHub 仓库
4. 配置：
   - **Project name:** heart-practice
   - **Production branch:** main
   - **Build command:** cd frontend && npm install && npm run build
   - **Build output directory:** frontend/build
   - **Environment variables:**
     ```
     REACT_APP_API_URL=https://heart-practice-api.onrender.com
     ```

5. 点击 "Save and Deploy"
6. 等待部署完成

## 步骤 4：更新后端 CORS

部署完成后，更新后端 `index.js` 的 CORS 配置：

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://heart-practice.pages.dev',  // Cloudflare Pages URL
    'https://your-custom-domain.com'      // 如果有自定义域名
  ]
}));
```

提交并推送更新：
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render 会自动重新部署。

## 步骤 5：测试

1. 访问 Cloudflare Pages URL
2. 测试场景提取功能
3. 完成一次完整的 HEART 对话
4. 检查复盘报告和导出功能

## 成本估算

- **Cloudflare Pages:** 免费
- **Render.com:** 免费层（每月 750 小时）
- **DeepSeek API:** 按使用量计费

## 监控和维护

### 查看日志

**Render:**
- Dashboard → 你的服务 → Logs

**Cloudflare Pages:**
- Dashboard → 你的项目 → Deployments → View build log

### 更新部署

只需推送代码到 GitHub，两个平台都会自动重新部署。

## 故障排查

### 前端无法连接后端

1. 检查 `.env.production` 中的 API URL
2. 检查后端 CORS 配置
3. 查看浏览器控制台错误

### 后端 API 错误

1. 检查 Render 环境变量
2. 查看 Render 日志
3. 确认 DeepSeek API Key 有效

### 部署失败

1. 检查构建日志
2. 确认 package.json 依赖正确
3. 检查 Node.js 版本兼容性

## 下一步

- [ ] 添加自定义域名
- [ ] 设置 API 使用限制
- [ ] 添加用户反馈收集
- [ ] 性能监控和优化

---

部署完成后，记得在 PAI/History 中记录部署经验！
