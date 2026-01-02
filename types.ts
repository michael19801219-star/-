
export interface QuestionAnalysis {
  id: string;
  originalText: string;
  topic: string;
  isCorrect: boolean;
  studentAnswer: string;
  correctAnswer: string;
  explanation: {
    principle: string;
    logic: string;
    precautions: string;
    commonMistakes: string;
  };
}

export interface ChemistryReport {
  overallScore: number;
  weakPoints: string[];
  analyzedQuestions: QuestionAnalysis[];
}

export interface AIQuestion {
  id: string;
  text: string;
  options: { [key: string]: string };
  correctAnswer: string;
  explanation: string;
}

export enum AppState {
  HOME = 'HOME',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  REPORT = 'REPORT',
  PRACTICE = 'PRACTICE',
  CHAT = 'CHAT'
}
