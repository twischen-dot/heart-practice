import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Scene, Message, HeartStep, Review } from '../types';

interface AppState {
  scene: Scene | null;
  currentStep: HeartStep;
  messages: Message[];
  review: Review | null;
  setScene: (scene: Scene) => void;
  setCurrentStep: (step: HeartStep) => void;
  addMessage: (message: Message) => void;
  setReview: (review: Review) => void;
  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      scene: null,
      currentStep: 'H',
      messages: [],
      review: null,
      setScene: (scene) => set({ scene }),
      setCurrentStep: (step) => set({ currentStep: step }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setReview: (review) => set({ review }),
      reset: () => set({ scene: null, currentStep: 'H', messages: [], review: null }),
    }),
    {
      name: 'heart-practice-storage',
    }
  )
);
