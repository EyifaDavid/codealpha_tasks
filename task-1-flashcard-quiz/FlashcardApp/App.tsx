import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FlashcardProvider } from './src/context/FlashcardContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <FlashcardProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FlashcardProvider>
    </SafeAreaProvider>
  );
}
