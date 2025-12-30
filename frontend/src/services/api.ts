import axios from 'axios';
import { Scene, CoachResponse, Review } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const extractScene = async (description: string): Promise<Scene> => {
  const response = await api.post('/api/scene/extract', { description });
  return response.data;
};

export const sendMessage = async (
  step: string,
  scene: Scene,
  userMessage: string,
  history: string
): Promise<CoachResponse> => {
  const response = await api.post('/api/chat/message', {
    step,
    scene,
    userMessage,
    history,
  });
  return response.data;
};

export const generateReview = async (
  scene: Scene,
  conversation: string
): Promise<Review> => {
  const response = await api.post('/api/review/generate', {
    scene,
    conversation,
  });
  return response.data;
};
