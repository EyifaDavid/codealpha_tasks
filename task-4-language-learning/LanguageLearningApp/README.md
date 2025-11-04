# 🌍 LinguaLearn - Language Learning App

A comprehensive language learning platform with interactive lessons, quizzes, and progress tracking.

## 🎯 Features

- 🌍 **8 Languages** - Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese
- 📚 **Interactive Flashcards** - Learn vocabulary with pronunciation guides
- 🎯 **Quiz System** - Multiple choice questions with instant feedback
- 📈 **Progress Tracking** - Daily streaks, accuracy, words learned
- 🏆 **Achievements** - Earn badges for milestones
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations

## 🚀 Quick Start

```bash
# Navigate to project
cd task-4-language-learning\LanguageLearningApp

# Install dependencies
npm install

# Run the app
npm start
```

## 📱 Screens

1. **Onboarding** - Welcome screen with app introduction
2. **Language Selection** - Choose your learning language
3. **Dashboard** - Overview of progress and daily goals
4. **Lessons** - Interactive flashcard viewer
5. **Practice** - Quiz mode with feedback
6. **Profile** - Stats, achievements, and settings

## 🛠️ Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation (Stack + Tabs)
- Context API
- AsyncStorage
- Expo Linear Gradient

## 📦 Structure

```
02-lingua-learn/
├── App.tsx
└── src/
    ├── screens/
    │   ├── OnboardingScreen.tsx
    │   ├── LanguageSelectScreen.tsx
    │   ├── DashboardScreen.tsx
    │   ├── LessonsScreen.tsx
    │   ├── PracticeScreen.tsx
    │   └── ProfileScreen.tsx
    ├── context/
    │   └── AppContext.tsx
    ├── types/
    │   └── index.ts
    ├── constants/
    │   └── theme.ts
    └── data/
        └── languages.ts
```

## 🎓 Usage

### Select Language
1. Launch app
2. Tap "Get Started"
3. Choose learning language
4. Tap "Continue"

### Study Lessons
1. Go to "Lessons" tab
2. View flashcard
3. Tap "Show Translation"
4. Navigate with Previous/Next

### Take Quiz
1. Go to "Practice" tab
2. Read question
3. Select answer
4. Get instant feedback
5. View final score

## 🎨 Customization

### Add New Language
Edit `src/data/languages.ts`:
```typescript
export const LANGUAGES: Language[] = [
  { id: '9', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', code: 'ru' },
];
```

### Change Theme
Edit `src/constants/theme.ts`:
```typescript
export const COLORS = {
  primary: '#4F46E5',
  // Change colors here
};
```

## 📄 License

MIT License

## 🔗 Links

- [Main Repository](../../)
- [Flashcard App](../../task-1-flashcard-quiz/FlashcardApp/)
- [FitTrack](../../task-3-fitness-tracker/FitTrack/)
