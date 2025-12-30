# Cloudflare Workers 部署指南

## 已完成

✅ 后端代码已改写为 Workers 格式
✅ 配置文件已创建

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
cd /Users/macmini/ZCodeProject/heart-practice/workers
wrangler login
```

### 3. 设置 API Key（敏感信息）

```bash
wrangler secret put ANTHROPIC_API_KEY
# 输入：sk-ca284d066d1d4b1d90defb12f585f9ef
```

### 4. 部署到 Cloudflare Workers

```bash
wrangler deploy
```

部署成功后会显示 URL，例如：
```
https://heart-practice-api.your-subdomain.workers.dev
```

### 5. 测试 API

```bash
# 健康检查
curl https://heart-practice-api.your-subdomain.workers.dev/health

# 场景提取
curl -X POST https://heart-practice-api.your-subdomain.workers.dev/api/scene/extract \
  -H "Content-Type: application/json" \
  -d '{"description":"我想和老板谈加薪"}'
```

### 6. 部署前端到 Cloudflare Pages

1. 访问 https://pages.cloudflare.com
2. Create a project
3. 连接 GitHub: `twischen-dot/heart-practice`
4. 配置：
   - **Build command:** `cd frontend && npm install && npm run build`
   - **Build output:** `frontend/build`
   - **Environment variable:**
     ```
     REACT_APP_API_URL = https://heart-practice-api.your-subdomain.workers.dev
     ```
     （使用步骤4中的 Workers URL）

## 成本

- ✅ **完全免费**
- Workers: 100,000 请求/天
- Pages: 无限带宽

## 优势

- 全球 CDN 加速
- 无需信用卡
- 自动 HTTPS
- 零运维成本
