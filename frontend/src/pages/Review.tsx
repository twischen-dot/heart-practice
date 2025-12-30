import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { generateReview } from '../services/api';
import html2canvas from 'html2canvas';

export const Review: React.FC = () => {
  const { scene, messages, review, setReview, reset } = useStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scene || messages.length === 0) {
      navigate('/');
      return;
    }

    if (!review) {
      const fetchReview = async () => {
        try {
          const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
          const reviewData = await generateReview(scene, conversation);
          setReview(reviewData);
        } catch (error) {
          console.error('Generate review error:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchReview();
    } else {
      setLoading(false);
    }
  }, [scene, messages, review, setReview, navigate]);

  const handleExport = async () => {
    if (!reviewRef.current) return;

    try {
      const canvas = await html2canvas(reviewRef.current);
      const link = document.createElement('a');
      link.download = 'heart-review.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleRestart = () => {
    reset();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">生成复盘报告中...</div>
      </div>
    );
  }

  if (!review) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={reviewRef} className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">演练复盘报告</h1>

          {/* Scene Summary */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">场景</h3>
            <p className="text-gray-700">{scene?.summary}</p>
          </div>

          {/* Scores */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">HEART 各步骤评分</h3>
            <div className="space-y-3">
              {Object.entries(review.scores).map(([step, score]) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="w-8 font-bold text-indigo-600">{step}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-indigo-600 h-4 rounded-full transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="w-12 text-right font-semibold">{score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {review.highlights.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">亮点</h3>
              <ul className="space-y-2">
                {review.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">改进建议</h3>
            <ul className="space-y-2">
              {review.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-600">→</span>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Plan */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">行动计划</h3>
            <p className="text-gray-700">{review.actionPlan}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleExport}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            导出图片
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
};
