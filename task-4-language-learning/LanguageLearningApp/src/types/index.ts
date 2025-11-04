export interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  progress: number;
}

export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  language: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'translation' | 'listening';
}

export interface UserProgress {
  dailyStreak: number;
  totalLessons: number;
  completedLessons: number;
  wordsLearned: number;
  accuracy: number;
  studyTime: number;
}

export type RootStackParamList = {
  Onboarding: undefined;
  LanguageSelect: undefined;
  MainApp: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Lessons: undefined;
  Practice: undefined;
  Profile: undefined;
};
