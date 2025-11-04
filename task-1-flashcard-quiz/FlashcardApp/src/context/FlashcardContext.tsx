import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard, Category, AIGenerationRequest } from '../types';
import { ANTHROPIC_API_KEY } from '@env';

interface FlashcardContextType {
  flashcards: Flashcard[];
  categories: Category[];
  filteredFlashcards: Flashcard[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  updateFlashcard: (id: string, flashcard: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  clearSearch: () => void;
  generateFlashcardsFromTopic: (request: AIGenerationRequest) => Promise<void>;
  isGenerating: boolean;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

const FLASHCARDS_STORAGE_KEY = '@flashcards_data';
const CATEGORIES_STORAGE_KEY = '@categories_data';

const generateUniqueId = (): string => {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const filteredFlashcards = React.useMemo(() => {
    if (!flashcards || !Array.isArray(flashcards)) return [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) return flashcards;
    return flashcards.filter(card => {
      const question = card.question?.toLowerCase() || '';
      const answer = card.answer?.toLowerCase() || '';
      const category = card.category?.toLowerCase() || '';
      return question.includes(query) || answer.includes(query) || category.includes(query);
    });
  }, [flashcards, searchQuery]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isLoaded) saveFlashcards();
  }, [flashcards, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveCategories();
  }, [categories, isLoaded]);

  const loadInitialData = async (): Promise<void> => {
    try {
      const [storedFlashcards, storedCategories] = await Promise.all([
        AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_STORAGE_KEY),
      ]);

      if (storedFlashcards) {
        const parsedFlashcards: Flashcard[] = JSON.parse(storedFlashcards);
        setFlashcards(parsedFlashcards.map(card => ({ ...card, id: card.id || generateUniqueId() })));
      } else {
        setFlashcards([
          {
            id: generateUniqueId(),
            question: 'What is React Native?',
            answer: 'A framework for building native mobile apps using React',
            category: 'React Native',
            createdAt: Date.now(),
            type: 'text'
          },
          {
            id: generateUniqueId(),
            question: 'What is the quadratic formula?',
            answer: 'x = (-b ± √(b²-4ac)) / 2a',
            category: 'Math',
            createdAt: Date.now(),
            type: 'equation'
          },
        ]);
      }

      if (storedCategories) {
        const parsedCategories: Category[] = JSON.parse(storedCategories);
        setCategories(parsedCategories.map(cat => ({ ...cat, id: cat.id || generateUniqueId() })));
      } else {
        setCategories([
          { id: generateUniqueId(), name: 'React Native', color: '#61dafb' },
          { id: generateUniqueId(), name: 'Math', color: '#ff6b6b' },
        ]);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setIsLoaded(true);
    }
  };

  const saveFlashcards = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
    } catch (error) {
      console.error('Error saving flashcards:', error);
    }
  };

  const saveCategories = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const addFlashcard = (flashcard: Omit<Flashcard, 'id' | 'createdAt'>): void => {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: generateUniqueId(),
      createdAt: Date.now(),
      type: flashcard.type || 'text',
    };
    setFlashcards(prev => [...prev, newFlashcard]);
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>): void => {
    setFlashcards(prev => prev.map(card => card.id === id ? { ...card, ...updates } : card));
  };

  const deleteFlashcard = (id: string): void => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>): void => {
    const newCategory: Category = { ...category, id: generateUniqueId() };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (id: string): void => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const clearSearch = (): void => {
    setSearchQuery('');
  };

  // REAL AI Generation using ENV variable
  const generateFlashcardsFromTopic = async (request: AIGenerationRequest): Promise<void> => {
    setIsGenerating(true);
    try {
      if (!ANTHROPIC_API_KEY) {
        throw new Error('API key not configured. Please add ANTHROPIC_API_KEY to your .env file');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2048,
          messages: [{
            role: 'user',
            content: `Generate ${request.numberOfCards} educational flashcards about "${request.topic}" at ${request.difficulty} difficulty level.

CRITICAL: Return ONLY a valid JSON array with NO additional text, explanations, or markdown.

Format EXACTLY:
[
  {
    "question": "Clear, specific question",
    "answer": "Comprehensive, educational answer",
    "category": "${request.topic}",
    "type": "text"
  }
]

Rules:
1. For math/science/technical topics, include cards with type: "equation"
2. For equation cards, use Unicode symbols: ×, ÷, √, ², ³, π, ∑, ∫, ±, ≤, ≥, ≠, α, β, γ, θ, Δ, Ω
3. Make questions clear and answers detailed
4. Difficulty ${request.difficulty}: adjust complexity accordingly
5. RETURN ONLY THE JSON ARRAY - no other text`
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        if (response.status === 401) throw new Error('Invalid API key');
        if (response.status === 429) throw new Error('Rate limit exceeded. Please try again in a moment');
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('Invalid response:', content);
        throw new Error('AI returned invalid format');
      }

      const generatedCards = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(generatedCards) || generatedCards.length === 0) {
        throw new Error('No cards generated');
      }

      // Create category if needed
      const categoryExists = categories.some(cat => 
        cat.name.toLowerCase() === request.topic.toLowerCase()
      );
      
      if (!categoryExists) {
        addCategory({
          name: request.topic,
          color: getRandomColor()
        });
      }

      // Add generated cards
      generatedCards.forEach((card: any) => {
        addFlashcard({
          question: card.question,
          answer: card.answer,
          category: card.category || request.topic,
          type: card.type || 'text'
        });
      });
      
    } catch (error: any) {
      console.error('Generation error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const getRandomColor = (): string => {
    const colors = ['#61dafb', '#3178c6', '#f7df1e', '#51cf66', '#ff6b6b', '#cc5de8', '#339af0', '#ff922b', '#94d82d', '#f06595', '#20c997', '#845ef7'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <FlashcardContext.Provider
      value={{
        flashcards,
        categories,
        filteredFlashcards,
        searchQuery,
        setSearchQuery,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        addCategory,
        deleteCategory,
        clearSearch,
        generateFlashcardsFromTopic,
        isGenerating,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = (): FlashcardContextType => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within FlashcardProvider');
  }
  return context;
};