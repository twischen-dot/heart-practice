import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { extractScene } from '../services/api';

export const SceneInput: React.FC = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setScene } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('请输入场景描述');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const scene = await extractScene(description);
      setScene(scene);
      navigate('/practice');
    } catch (err) {
      setError('场景提取失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">HEART 对话演练</h1>
        <p className="text-gray-600 mb-8">描述你想练习的沟通场景</p>

        <textarea
          className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
          placeholder="例如：我是团队负责人，需要和一位下属沟通他最近的工作表现问题。他是一位资深工程师，最近两个月交付延期，代码质量也有所下降。我希望了解原因并帮助他改进..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? '分析中...' : '开始演练'}
        </button>
      </div>
    </div>
  );
};
