const express = require('express');
const router = express.Router();
const { callClaude } = require('../utils/claude');
const { getChatSystemPrompt } = require('../prompts/chat');
const { checkStepCompletion, HEART_STEPS } = require('../utils/heart');

router.post('/message', async (req, res) => {
  try {
    const { step, scene, userMessage, history } = req.body;

    if (!step || !scene || !userMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 检查步骤完成度
    const completion = checkStepCompletion(step, userMessage);

    // 调用Claude生成回复
    const systemPrompt = getChatSystemPrompt(step, scene);
    const contextMessage = history
      ? `对话历史：\n${history}\n\n用户当前发言：${userMessage}`
      : `用户发言：${userMessage}`;

    const response = await callClaude(systemPrompt, contextMessage, 512);

    // 清理DeepSeek返回的markdown代码块
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
    cleanedResponse = cleanedResponse.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');

    const parsed = JSON.parse(cleanedResponse);

    res.json({
      ...parsed,
      stepCompleted: completion.passed,
      feedback: completion.passed ? '很好！可以进入下一步' : completion.reason,
      nextStep: completion.passed && step !== 'T'
        ? HEART_STEPS[HEART_STEPS.indexOf(step) + 1]
        : step,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

module.exports = router;
