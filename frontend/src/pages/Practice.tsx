import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { sendMessage } from '../services/api';

const STEPS = ['H', 'E', 'A', 'R', 'T'];
const STEP_NAMES = {
  H: 'Hear - 倾听',
  E: 'Empathy - 共情',
  A: 'Ask - 提问',
  R: 'Respond - 回应',
  T: 'Track - 追踪',
};

export const Practice: React.FC = () => {
  const { scene, currentStep, messages, addMessage, setCurrentStep } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachTips, setCoachTips] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  if (!scene) {
    navigate('/');
    return null;
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user' as const, content: input, timestamp: Date.now() };
    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await sendMessage(currentStep, scene, input, history);

      const otherMessage = {
        role: 'other' as const,
        content: response.roleReply,
        timestamp: Date.now(),
      };
      addMessage(otherMessage);

      setCoachTips(response.coachTips);
      setSuggestions(response.suggestions);

      if (response.stepCompleted && response.nextStep !== currentStep) {
        setCurrentStep(response.nextStep as any);
        if (response.nextStep === 'T' && STEPS.indexOf(response.nextStep) === 4) {
          setTimeout(() => navigate('/review'), 2000);
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-3">{scene.summary}</h2>
          <div className="flex gap-2">
            {STEPS.map((step, idx) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  STEPS.indexOf(currentStep) >= idx ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            当前步骤: {STEP_NAMES[currentStep as keyof typeof STEP_NAMES]}
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-6xl mx-auto w-full overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入你的回复..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? '...' : '发送'}
            </button>
          </div>
        </div>

        {/* Coach Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-4">教练提示</h3>

          {coachTips.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">建议</h4>
              <ul className="space-y-2">
                {coachTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">可点用话术</h4>
              <div className="space-y-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(sug)}
                    className="w-full text-left text-sm text-indigo-600 bg-indigo-50 p-2 rounded hover:bg-indigo-100"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
