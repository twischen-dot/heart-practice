export interface Scene {
  roles: string;
  problem: string;
  goal: string;
  constraints: string;
  summary: string;
}

export interface Message {
  role: 'user' | 'other';
  content: string;
  timestamp: number;
}

export interface CoachResponse {
  roleReply: string;
  coachTips: string[];
  suggestions: string[];
  stepCompleted: boolean;
  feedback: string;
  nextStep: string;
}

export interface Review {
  scores: {
    H: number;
    E: number;
    A: number;
    R: number;
    T: number;
  };
  improvements: string[];
  highlights: string[];
  actionPlan: string;
}

export type HeartStep = 'H' | 'E' | 'A' | 'R' | 'T';
