# i7Relay 中继服务配置指南

## 什么是i7Relay？

i7Relay是一个API中继服务，可以帮助国内用户更稳定地访问Claude API。

## 配置步骤

### 1. 创建.env文件

在 `backend` 目录下创建 `.env` 文件：

```bash
cd /Users/macmini/ZCodeProject/heart-practice/backend
touch .env
```

### 2. 配置环境变量

编辑 `.env` 文件，填入以下内容：

```env
ANTHROPIC_API_KEY=i7-relay-Iw5kG9LgRaRui-gpDI9Ud8vPqw79K9AiPEPoPOJz6d1rpb5VVSwoFEIm8LuvfLMQ
ANTHROPIC_BASE_URL=https://relay.i7.io/v1
PORT=3001
```

**重要说明**：
- `ANTHROPIC_API_KEY`: 填入你的i7Relay API key
- `ANTHROPIC_BASE_URL`: i7Relay的API端点（请确认正确的URL）

### 3. 验证配置

启动后端服务测试：

```bash
cd backend
npm start
```

查看日志，确认没有API错误。

## 常见的i7Relay端点

根据不同的i7Relay服务商，端点可能不同：

- `https://relay.i7.io/v1`
- `https://api.i7relay.com/v1`
- `https://i7relay.com/api/v1`

**请根据你的i7Relay服务商提供的文档确认正确的端点URL。**

## 测试API连接

创建测试脚本 `backend/test-api.js`：

```javascript
require('dotenv').config();
const { callClaude } = require('./utils/claude');

async function test() {
  try {
    console.log('Testing API connection...');
    const response = await callClaude(
      'You are a helpful assistant.',
      'Say hello in Chinese.',
      100
    );
    console.log('Success! Response:', response);
  } catch (error) {
    console.error('API Test Failed:', error.message);
  }
}

test();
```

运行测试：
```bash
node backend/test-api.js
```

## 故障排查

### 问题1: 401 Unauthorized
**原因**: API key无效或已过期
**解决**: 检查i7Relay后台，确认key是否有效

### 问题2: 404 Not Found
**原因**: API端点URL错误
**解决**: 确认 `ANTHROPIC_BASE_URL` 配置正确

### 问题3: 网络超时
**原因**: 网络连接问题
**解决**: 检查网络连接，或联系i7Relay客服

## 与标准Claude API的区别

| 项目 | 标准Claude API | i7Relay |
|------|---------------|---------|
| API Key格式 | `sk-ant-xxxxx` | `i7-relay-xxxxx` |
| 端点 | `https://api.anthropic.com` | `https://relay.i7.io/v1` |
| 访问限制 | 需要国际网络 | 国内可直接访问 |
| 费用 | 官方定价 | 中继服务费用 |

## 注意事项

1. **安全性**: 不要将API key提交到Git仓库
2. **费用**: 注意i7Relay的计费方式
3. **稳定性**: 中继服务可能有延迟或不稳定
4. **合规性**: 确保使用符合服务条款

## 获取i7Relay服务

如果你还没有i7Relay账号：
1. 访问i7Relay官网注册
2. 创建API key
3. 充值并开始使用

---

**配置完成后，按照TESTING_GUIDE.md进行功能测试。**
