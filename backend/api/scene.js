const express = require('express');
const router = express.Router();
const { callClaude } = require('../utils/claude');
const { SCENE_EXTRACTION_PROMPT } = require('../prompts/scene');

router.post('/extract', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const response = await callClaude(
      SCENE_EXTRACTION_PROMPT,
      description,
      512
    );

    // 清理DeepSeek返回的markdown代码块
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
    cleanedResponse = cleanedResponse.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');

    const scene = JSON.parse(cleanedResponse);
    res.json(scene);
  } catch (error) {
    console.error('Scene extraction error:', error);
    res.status(500).json({ error: 'Failed to extract scene' });
  }
});

module.exports = router;
