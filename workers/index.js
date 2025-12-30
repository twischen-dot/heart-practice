export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // Health check
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Scene extraction
      if (url.pathname === '/api/scene/extract' && request.method === 'POST') {
        const { description } = await request.json();

        if (!description) {
          return new Response(JSON.stringify({ error: 'Description is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const scene = await extractScene(description, env);
        return new Response(JSON.stringify(scene), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Chat message
      if (url.pathname === '/api/chat/message' && request.method === 'POST') {
        const { step, scene, userMessage, history } = await request.json();
        const response = await handleChat(step, scene, userMessage, history, env);
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Generate review
      if (url.pathname === '/api/review/generate' && request.method === 'POST') {
        const { scene, conversation } = await request.json();
        const review = await generateReview(scene, conversation, env);
        return new Response(JSON.stringify(review), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Scene extraction
async function extractScene(description, env) {
  const prompt = `你是一个场景分析专家。用户会描述一个沟通场景，你需要提取关键信息并以JSON格式返回。

输出格式（必须是有效的JSON）：
{
  "roles": "角色关系（如：上级与下属、同事之间）",
  "problem": "问题类型（如：绩效问题、协作冲突）",
  "goal": "沟通目标",
  "constraints": "约束条件",
  "summary": "场景摘要（50字内）"
}

只返回JSON，不要其他内容。`;

  const response = await callClaude(prompt, description, 512, env);

  // Clean markdown code blocks
  let cleaned = response.trim()
    .replace(/^```json\s*\n?/, '')
    .replace(/\n?```\s*$/, '')
    .replace(/^```\s*\n?/, '')
    .replace(/\n?```\s*$/, '');

  return JSON.parse(cleaned);
}

// Chat handler
async function handleChat(step, scene, userMessage, history, env) {
  const systemPrompt = getChatPrompt(step, scene);
  const response = await callClaude(systemPrompt, userMessage, 1024, env);

  // Parse response (simplified)
  return {
    coachMessage: response,
    suggestedResponse: '',
    passed: true,
    nextStep: getNextStep(step)
  };
}

// Review generator
async function generateReview(scene, conversation, env) {
  const prompt = `分析以下HEART对话演练，给出评分和建议。

场景：${JSON.stringify(scene)}
对话记录：${JSON.stringify(conversation)}

返回JSON格式：
{
  "overallScore": 85,
  "stepScores": {"H": 90, "E": 85, "A": 80, "R": 85, "T": 80},
  "strengths": ["优点1", "优点2"],
  "improvements": ["改进1", "改进2"],
  "summary": "总结"
}`;

  const response = await callClaude(prompt, '', 2048, env);
  let cleaned = response.trim()
    .replace(/^```json\s*\n?/, '')
    .replace(/\n?```\s*$/, '');

  return JSON.parse(cleaned);
}

// Claude API call
async function callClaude(systemPrompt, userMessage, maxTokens, env) {
  const response = await fetch(`${env.ANTHROPIC_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  const data = await response.json();
  return data.content[0].text;
}

// Helper functions
function getChatPrompt(step, scene) {
  const prompts = {
    'H': '你是HEART对话教练。当前步骤：Hear（倾听）。指导用户复述对方观点。',
    'E': '你是HEART对话教练。当前步骤：Empathy（共情）。指导用户表达理解。',
    'A': '你是HEART对话教练。当前步骤：Ask（提问）。指导用户提出开放式问题。',
    'R': '你是HEART对话教练。当前步骤：Respond（回应）。指导用户提出解决方案。',
    'T': '你是HEART对话教练。当前步骤：Track（追踪）。指导用户设定检查点。'
  };
  return prompts[step] || prompts['H'];
}

function getNextStep(currentStep) {
  const steps = ['H', 'E', 'A', 'R', 'T'];
  const index = steps.indexOf(currentStep);
  return index < steps.length - 1 ? steps[index + 1] : null;
}
