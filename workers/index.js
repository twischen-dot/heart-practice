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
  const contextMessage = history
    ? `对话历史：\n${history}\n\n用户当前发言：${userMessage}`
    : `用户发言：${userMessage}`;

  const response = await callClaude(systemPrompt, contextMessage, 1024, env);

  // Clean markdown code blocks
  let cleaned = response.trim()
    .replace(/^```json\s*\n?/, '')
    .replace(/\n?```\s*$/, '')
    .replace(/^```\s*\n?/, '')
    .replace(/\n?```\s*$/, '');

  const parsed = JSON.parse(cleaned);
  const completion = checkStepCompletion(step, userMessage);

  return {
    ...parsed,
    stepCompleted: completion.passed,
    feedback: completion.passed ? '很好！可以进入下一步' : completion.reason,
    nextStep: completion.passed && step !== 'T' ? getNextStep(step) : step
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
  const stepDefs = {
    'H': { name: '倾听', goal: '复述对方观点，确认理解' },
    'E': { name: '共情', goal: '表达理解和同理心' },
    'A': { name: '提问', goal: '提出开放式问题，深入了解' },
    'R': { name: '回应', goal: '提出具体解决方案' },
    'T': { name: '追踪', goal: '设定时间节点和检查点' }
  };

  const stepDef = stepDefs[step] || stepDefs['H'];

  return `你是一个HEART对话演练系统，同时扮演两个角色：

1. **对方角色**：根据场景扮演对话中的另一方
   - 场景：${scene.summary}
   - 角色关系：${scene.roles}
   - 问题类型：${scene.problem}

2. **教练角色**：为用户提供指导

当前步骤：${step} - ${stepDef.name}
步骤目标：${stepDef.goal}

输出格式（必须是有效的JSON）：
{
  "roleReply": "对方的回复（自然对话，30-50字）",
  "coachTips": ["教练提示1", "教练提示2"],
  "suggestions": ["可点用话术1", "可点用话术2", "可点用话术3"]
}

要求：
- roleReply要符合对方的角色和情绪
- coachTips要针对当前步骤给出具体建议
- suggestions要提供可直接使用的话术示例

只返回JSON，不要其他内容。`;
}

function getNextStep(currentStep) {
  const steps = ['H', 'E', 'A', 'R', 'T'];
  const index = steps.indexOf(currentStep);
  return index < steps.length - 1 ? steps[index + 1] : null;
}

function checkStepCompletion(step, userMessage) {
  const rules = {
    'H': {
      keywords: ['听到', '了解', '你说的是', '你的意思是', '我理解你说'],
      minLength: 20
    },
    'E': {
      keywords: ['理解', '感受', '能想象', '可以理解', '换位思考'],
      minLength: 15
    },
    'A': {
      keywords: ['?', '吗', '呢', '如何', '怎么', '为什么'],
      minLength: 10
    },
    'R': {
      keywords: ['建议', '可以', '我们', '方案', '计划', '行动'],
      minLength: 20
    },
    'T': {
      keywords: ['时间', '截止', '检查', '跟进', '确认', '下次'],
      minLength: 15
    }
  };

  const rule = rules[step];
  if (!rule) return { passed: false, reason: '无效的步骤' };

  const hasKeyword = rule.keywords.some(kw => userMessage.includes(kw));
  const meetsLength = userMessage.length >= rule.minLength;

  if (!hasKeyword) {
    return { passed: false, reason: `需要包含关键词：${rule.keywords.join('、')}` };
  }
  if (!meetsLength) {
    return { passed: false, reason: `回复至少需要${rule.minLength}字` };
  }

  return { passed: true, reason: '' };
}
