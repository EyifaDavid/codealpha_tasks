import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, Lesson, Flashcard, UserProgress } from '../types';
import { LANGUAGES } from '../data/languages';

interface AppContextType {
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language) => void;
  userProgress: UserProgress;
  lessons: Lesson[];
  flashcards: Flashcard[];
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  completeLesson: (lessonId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    dailyStreak: 7,
    totalLessons: 20,
    completedLessons: 8,
    wordsLearned: 156,
    accuracy: 85,
    studyTime: 240,
  });

  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Basic Greetings',
      description: 'Learn essential greetings and introductions',
      language: 'Spanish',
      difficulty: 'beginner',
      completed: true,
      progress: 100,
    },
    {
      id: '2',
      title: 'Numbers 1-20',
      description: 'Master counting from 1 to 20',
      language: 'Spanish',
      difficulty: 'beginner',
      completed: true,
      progress: 100,
    },
    {
      id: '3',
      title: 'Common Phrases',
      description: 'Everyday expressions for daily conversation',
      language: 'Spanish',
      difficulty: 'beginner',
      completed: false,
      progress: 60,
    },
    {
      id: '4',
      title: 'Food & Dining',
      description: 'Vocabulary for restaurants and meals',
      language: 'Spanish',
      difficulty: 'intermediate',
      completed: false,
      progress: 0,
    },
  ]);

  const [flashcards] = useState<Flashcard[]>([
    {
      id: '1',
      word: 'Hola',
      translation: 'Hello',
      pronunciation: 'OH-lah',
      example: 'Hola, ¿cómo estás?',
      language: 'Spanish',
      category: 'Greetings',
    },
    {
      id: '2',
      word: 'Gracias',
      translation: 'Thank you',
      pronunciation: 'GRAH-see-ahs',
      example: 'Muchas gracias por tu ayuda',
      language: 'Spanish',
      category: 'Common Phrases',
    },
    {
      id: '3',
      word: 'Buenos días',
      translation: 'Good morning',
      pronunciation: 'BWEH-nos DEE-ahs',
      example: 'Buenos días, señor',
      language: 'Spanish',
      category: 'Greetings',
    },
    {
      id: '4',
      word: 'Por favor',
      translation: 'Please',
      pronunciation: 'por fah-VOR',
      example: 'Un café, por favor',
      language: 'Spanish',
      category: 'Common Phrases',
    },
  ]);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const completeLesson = (lessonId: string) => {
    setUserProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons + 1,
      wordsLearned: prev.wordsLearned + 10,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        userProgress,
        lessons,
        flashcards,
        hasCompletedOnboarding,
        completeOnboarding,
        completeLesson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};