const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
});

async function callClaude(systemPrompt, userMessage, maxTokens = 1024) {
  try {
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
    const response = await client.messages.create({
      model: model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

module.exports = { callClaude };
