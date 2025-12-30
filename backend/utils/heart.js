const HEART_STEPS = ['H', 'E', 'A', 'R', 'T'];

const STEP_DEFINITIONS = {
  H: {
    name: 'Hear',
    goal: '倾听并复述对方的观点，确认理解',
    keywords: ['听到', '了解', '你说的是', '你的意思是', '我理解你说'],
    minLength: 20,
  },
  E: {
    name: 'Empathy',
    goal: '表达共情，理解对方的感受',
    keywords: ['理解', '感受', '能想象', '可以理解', '换位思考'],
    minLength: 15,
  },
  A: {
    name: 'Ask',
    goal: '提出开放式问题，深入了解',
    keywords: ['?', '吗', '呢', '如何', '怎么', '为什么'],
    minLength: 10,
  },
  R: {
    name: 'Respond',
    goal: '提出具体的行动方案',
    keywords: ['建议', '可以', '我们', '方案', '计划', '行动'],
    minLength: 20,
  },
  T: {
    name: 'Track',
    goal: '明确时间节点和检查点',
    keywords: ['时间', '截止', '检查', '跟进', '确认', '下次'],
    minLength: 15,
  },
};

function checkStepCompletion(step, userMessage) {
  const def = STEP_DEFINITIONS[step];

  // 长度检查
  if (userMessage.length < def.minLength) {
    return {
      passed: false,
      reason: `内容太短，建议至少${def.minLength}字`,
    };
  }

  // 关键词检查
  const hasKeyword = def.keywords.some(kw => userMessage.includes(kw));
  if (!hasKeyword) {
    return {
      passed: false,
      reason: `建议使用相关表达，如：${def.keywords.slice(0, 3).join('、')}`,
    };
  }

  return { passed: true };
}

module.exports = {
  HEART_STEPS,
  STEP_DEFINITIONS,
  checkStepCompletion,
};
