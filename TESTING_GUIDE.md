# 快速测试指南

## 前置准备

1. 获取Claude API Key
   - 访问: https://console.anthropic.com/
   - 创建API Key
   - 复制key

2. 配置环境变量
```bash
cd /Users/macmini/ZCodeProject/heart-practice/backend
cp .env.example .env
# 编辑.env文件，填入你的API Key
```

## 启动测试

### 方式1: 分别启动（推荐用于开发）

```bash
# 终端1 - 启动后端
cd /Users/macmini/ZCodeProject/heart-practice/backend
npm start

# 终端2 - 启动前端
cd /Users/macmini/ZCodeProject/heart-practice/frontend
npm start
```

### 方式2: 后台启动

```bash
# 启动后端（后台）
cd /Users/macmini/ZCodeProject/heart-practice/backend
nohup npm start > backend.log 2>&1 &

# 启动前端
cd /Users/macmini/ZCodeProject/heart-practice/frontend
npm start
```

## 测试流程

### 1. 访问首页
打开浏览器访问: http://localhost:3000

### 2. 输入测试场景
复制以下场景到输入框:

```
我是团队负责人，需要和下属小王沟通他最近的工作表现问题。
小王是一位资深工程师，工作能力很强，但最近两个月出现了多次交付延期，
代码质量也有所下降。我了解到他最近家里有些事情，但项目进度确实受到了影响。
我希望通过这次对话了解他的真实情况，同时帮助他改进工作状态。
```

点击"开始演练"

### 3. 进行HEART演练

**H步 (Hear - 倾听)** 测试输入:
```
小王，我注意到你最近两个月的项目交付有些延期，
我想了解一下具体是什么情况。你能跟我说说吗？
```

**E步 (Empathy - 共情)** 测试输入:
```
我能理解你现在的处境确实不容易，家里的事情肯定会影响工作状态。
这种情况下还能坚持工作，我很感谢你的付出。
```

**A步 (Ask - 提问)** 测试输入:
```
你觉得现在最需要什么样的支持？
是需要调整工作量，还是需要一些时间来处理家里的事情？
```

**R步 (Respond - 回应)** 测试输入:
```
我建议接下来两周，我们可以把你手上的项目优先级调整一下，
把最紧急的任务先完成，其他的可以适当延后。
同时如果需要请假处理家里的事，随时跟我说。
```

**T步 (Track - 追踪)** 测试输入:
```
那我们这周五下午再碰一次，看看调整后的进展如何。
如果有任何问题，随时找我。我会在项目管理系统里更新优先级。
```

### 4. 查看复盘报告
演练完成后会自动跳转到复盘页面，查看:
- HEART五项评分
- 亮点总结
- 改进建议
- 行动计划

### 5. 导出报告
点击"导出图片"按钮，下载复盘报告图片

## 验收检查清单

- [ ] 场景提取成功，显示场景卡片
- [ ] HEART五步按顺序推进
- [ ] 每步都有教练提示
- [ ] 可点用话术能插入到输入框
- [ ] 过关判定正常工作
- [ ] 复盘报告正确生成
- [ ] 导出图片功能正常
- [ ] UI响应流畅，无明显卡顿

## 常见问题

### Q1: 后端启动失败
**A**: 检查是否配置了ANTHROPIC_API_KEY环境变量

### Q2: 前端无法连接后端
**A**: 确认后端已启动在3001端口，检查CORS配置

### Q3: Claude API调用失败
**A**:
- 检查API Key是否有效
- 检查网络连接
- 查看后端日志: `tail -f backend.log`

### Q4: 页面样式异常
**A**: 确认Tailwind CSS已正确配置，运行 `npm install` 重新安装依赖

## 性能测试

### 响应时间目标
- 场景提取: < 3秒
- 对话回复: < 3秒
- 复盘生成: < 5秒

### 测试方法
```bash
# 测试场景提取API
time curl -X POST http://localhost:3001/api/scene/extract \
  -H "Content-Type: application/json" \
  -d '{"description":"测试场景"}'
```

## 下一步

测试通过后，可以:
1. 部署到Vercel
2. 邀请用户试用
3. 收集反馈
4. 迭代优化

---

**测试完成后请填写反馈表**
- 功能完整性: ⭐⭐⭐⭐⭐
- 用户体验: ⭐⭐⭐⭐⭐
- 响应速度: ⭐⭐⭐⭐⭐
- 改进建议: ___________
