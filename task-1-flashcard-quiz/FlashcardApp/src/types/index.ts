export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: number;
  type: 'text' | 'equation' | 'image';
  equationData?: string;
  imageUri?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface AIGenerationRequest {
  topic: string;
  numberOfCards: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PDFUpload {
  uri: string;
  name: string;
  size: number;
}

export type RootTabParamList = {
  Home: undefined;
  Study: undefined;
  Manage: undefined;
  Settings: undefined;
};
