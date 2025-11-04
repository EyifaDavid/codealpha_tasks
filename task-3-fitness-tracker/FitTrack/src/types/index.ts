export interface Workout {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
  notes?: string;
  completed: boolean; 
  createdAt: number;
}

export interface DailyStats {
  date: string;
  steps: number;
  calories: number;
  workouts: number;
  waterIntake: number;
  sleep: number;
}

export interface Goal {
  id: string;
  type: 'steps' | 'calories' | 'workouts' | 'water' | 'sleep';
  target: number;
  current: number;
  completed: boolean;
}

export type RootStackParamList = {
  MainTabs: undefined;
  AddWorkout: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Activities: undefined;
  Progress: undefined;
  Profile: undefined;
};

