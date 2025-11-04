import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS, SIZES, SPACING } from '../constants/themes';
import { useFlashcards } from '../context/FlashcardContext';

export const AIGenerationScreen = () => {
  const { generateFlashcardsFromTopic, generateFlashcardsFromPDF, isGenerating } = useFlashcards();
  const [topic, setTopic] = useState('');
  const [numberOfCards, setNumberOfCards] = useState('5');
  const [difficulty, setDifficulty] = useState('medium');

  const handleTopicGeneration = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    try {
      await generateFlashcardsFromTopic({
        topic: topic.trim(),
        numberOfCards: parseInt(numberOfCards),
        difficulty: difficulty,
      });
      Alert.alert('Success', `Generated ${numberOfCards} flashcards for "${topic}"`);
      setTopic('');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate flashcards. Please try again.');
    }
  };

  const handlePDFUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        await generateFlashcardsFromPDF({
          uri: result.uri,
          name: result.name,
          size: result.size,
        });
        Alert.alert('Success', 'Flashcards generated from PDF!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process PDF. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Flashcard Generator</Text>
      <Text style={styles.subtitle}>
        Generate flashcards automatically from topics or PDF documents
      </Text>

      {/* Topic-based Generation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate from Topic</Text>
        
        <Text style={styles.label}>Topic</Text>
        <TextInput
          style={styles.input}
          value={topic}
          onChangeText={setTopic}
          placeholder="e.g., Quantum Physics, Calculus, French Vocabulary"
          placeholderTextColor={COLORS.textLight}
        />

        <Text style={styles.label}>Number of Cards</Text>
        <View style={styles.numberSelector}>
          {[3, 5, 10].map(num => (
            <TouchableOpacity
              key={num}
              style={[
                styles.numberButton,
                numberOfCards === num.toString() && styles.numberButtonSelected,
              ]}
              onPress={() => setNumberOfCards(num.toString())}
            >
              <Text style={[
                styles.numberButtonText,
                numberOfCards === num.toString() && styles.numberButtonTextSelected,
              ]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.difficultySelector}>
          {['easy', 'medium', 'hard'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.difficultyButtonSelected,
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text style={[
                styles.difficultyButtonText,
                difficulty === level && styles.difficultyButtonTextSelected,
              ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleTopicGeneration}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.generateButtonText}>
              Generate Flashcards
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* PDF-based Generation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate from PDF</Text>
        <Text style={styles.description}>
          Upload a PDF document and let AI extract key concepts to create flashcards
        </Text>

        <TouchableOpacity
          style={styles.pdfButton}
          onPress={handlePDFUpload}
          disabled={isGenerating}
        >
          <Text style={styles.pdfButtonText}>📄 Upload PDF Document</Text>
          <Text style={styles.pdfButtonSubtext}>
            Supports .pdf files up to 10MB
          </Text>
        </TouchableOpacity>
      </View>

      {/* Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Example Topics</Text>
        <View style={styles.examplesContainer}>
          {[
            'Machine Learning Basics',
            'Spanish Verb Conjugations',
            'Organic Chemistry Reactions',
            'World War II Timeline',
            'Python Programming Concepts'
          ].map(example => (
            <TouchableOpacity
              key={example}
              style={styles.exampleButton}
              onPress={() => setTopic(example)}
            >
              <Text style={styles.exampleText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  section: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  numberSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  numberButton: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numberButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  numberButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  numberButtonTextSelected: {
    color: '#ffffff',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  difficultyButton: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  difficultyButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  difficultyButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  difficultyButtonTextSelected: {
    color: '#ffffff',
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  generateButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  pdfButton: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  pdfButtonText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  pdfButtonSubtext: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  examplesContainer: {
    gap: SPACING.sm,
  },
  exampleButton: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  exampleText: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
});