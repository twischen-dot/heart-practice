const express = require('express');
const router = express.Router();
const { callClaude } = require('../utils/claude');

const REVIEW_PROMPT = `你是一个HEART对话复盘专家。根据用户的演练记录，生成结构化复盘报告。

输出格式（必须是有效的JSON）：
{
  "scores": {
    "H": 80,
    "E": 75,
    "A": 85,
    "R": 70,
    "T": 90
  },
  "improvements": [
    "改进建议1",
    "改进建议2",
    "改进建议3"
  ],
  "highlights": ["亮点1", "亮点2"],
  "actionPlan": "具体的行动计划总结"
}

只返回JSON，不要其他内容。`;

router.post('/generate', async (req, res) => {
  try {
    const { scene, conversation } = req.body;

    if (!scene || !conversation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userMessage = `场景：${scene.summary}\n\n对话记录：\n${conversation}`;
    const response = await callClaude(REVIEW_PROMPT, userMessage, 1024);

    // 清理DeepSeek返回的markdown代码块
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
    cleanedResponse = cleanedResponse.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');

    const review = JSON.parse(cleanedResponse);

    res.json(review);
  } catch (error) {
    console.error('Review generation error:', error);
    res.status(500).json({ error: 'Failed to generate review' });
  }
});

module.exports = router;
