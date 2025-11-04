// ============================================
// GUARANTEED WORKING - INLINE MATH KEYBOARD
// No modal issues, always visible, simple to use
// ============================================

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
  ActivityIndicator
} from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/themes';
import { useFlashcards } from '../context/FlashcardContext';

export const ManageScreen = () => {
  const { 
    flashcards, 
    categories, 
    addFlashcard, 
    deleteFlashcard, 
    addCategory,
    deleteCategory,
    generateFlashcardsFromTopic,
    isGenerating
  } = useFlashcards();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#61dafb');
  const [flashcardType, setFlashcardType] = useState('text');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCardCount, setAiCardCount] = useState('5');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [activeTab, setActiveTab] = useState('flashcards');
  
  // Math keyboard state - INLINE approach
  const [showMathKeyboard, setShowMathKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'question' | 'answer'>('question');

  const categoryColors = [
    '#61dafb', '#3178c6', '#f7df1e', '#51cf66', '#ff6b6b', '#cc5de8',
    '#339af0', '#ff922b', '#94d82d', '#f06595', '#20c997', '#845ef7'
  ];

  // Symbol categories for inline keyboard
  const mathSymbols = [
    { category: 'Operations', symbols: ['×', '÷', '±', '√'] },
    { category: 'Powers', symbols: ['²', '³', 'ⁿ'] },
    { category: 'Comparisons', symbols: ['≤', '≥', '≠', '≈'] },
    { category: 'Greek', symbols: ['α', 'β', 'γ', 'π', 'θ', 'Σ', 'Δ', 'Ω'] },
    { category: 'Calculus', symbols: ['∫', '∂', '∞', '∑'] },
    { category: 'Misc', symbols: ['°', '/', '()', '[]'] },
  ];

  const insertSymbol = (symbol: string) => {
    if (activeInput === 'question') {
      setQuestion(prev => prev + symbol);
    } else {
      setAnswer(prev => prev + symbol);
    }
  };

  const handleAddFlashcard = () => {
    if (question.trim() && answer.trim() && selectedCategory) {
      addFlashcard({ 
        question, 
        answer, 
        category: selectedCategory,
        type: flashcardType
      });
      setQuestion('');
      setAnswer('');
      setSelectedCategory('');
      setFlashcardType('text');
      setModalVisible(false);
      setShowMathKeyboard(false); // Reset keyboard
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({ 
        name: newCategoryName.trim(), 
        color: newCategoryColor 
      });
      setNewCategoryName('');
      setNewCategoryColor('#61dafb');
      setCategoryModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter a category name');
    }
  };

  const handleAiGeneration = async () => {
    if (!aiTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    try {
      await generateFlashcardsFromTopic({
        topic: aiTopic.trim(),
        numberOfCards: parseInt(aiCardCount),
        difficulty: aiDifficulty as 'easy' | 'medium' | 'hard',
      });
      Alert.alert('Success', `Generated ${aiCardCount} flashcards for "${aiTopic}"!`);
      setAiTopic('');
      setAiModalVisible(false);
    } catch (error: any) {
      Alert.alert('AI Generation Error', error.message || 'Failed to generate flashcards');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const cardsInCategory = flashcards.filter(card => {
      const category = categories.find(cat => cat.id === categoryId);
      return category && card.category === category.name;
    });

    if (cardsInCategory.length > 0) {
      Alert.alert(
        'Cannot Delete',
        `This category has ${cardsInCategory.length} flashcard(s). Please move or delete them first.`
      );
      return;
    }

    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteCategory(categoryId)
        }
      ]
    );
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'equation': return '🧮';
      case 'image': return '🖼️';
      default: return '📝';
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'flashcards' && styles.activeTab]}
          onPress={() => setActiveTab('flashcards')}
        >
          <Text style={[styles.tabText, activeTab === 'flashcards' && styles.activeTabText]}>
            Flashcards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
          onPress={() => setActiveTab('categories')}
        >
          <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>
            Categories
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'flashcards' ? (
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Manage Flashcards</Text>
              <View style={styles.addButtonGroup}>
                <TouchableOpacity
                  style={[styles.addButton, styles.addButtonPrimary]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.addButtonText}>+ Add Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.addButtonSecondary]}
                  onPress={() => setAiModalVisible(true)}
                >
                  <Text style={styles.addButtonText}>🤖 AI Generate</Text>
                </TouchableOpacity>
              </View>
            </View>

            {flashcards.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No flashcards yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Create your first flashcard or use AI generation
                </Text>
                <TouchableOpacity
                  style={styles.aiSuggestionButton}
                  onPress={() => setAiModalVisible(true)}
                >
                  <Text style={styles.aiSuggestionText}>Try AI Generation →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              flashcards.map(card => (
                <View key={card.id} style={styles.cardItem}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={[
                        styles.categoryBadge,
                        { backgroundColor: categories.find(cat => cat.name === card.category)?.color || COLORS.primary }
                      ]}>
                        <Text style={styles.categoryBadgeText}>{card.category}</Text>
                      </View>
                      <Text style={styles.cardTypeIcon}>
                        {getCardTypeIcon(card.type)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.cardQuestion,
                      card.type === 'equation' && styles.equationText
                    ]}>
                      {card.question}
                    </Text>
                    <Text style={[
                      styles.cardAnswer,
                      card.type === 'equation' && styles.equationText
                    ]}>
                      {card.answer}
                    </Text>
                    {card.type === 'equation' && (
                      <Text style={styles.equationNote}>Contains mathematical equation</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteFlashcard(card.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ) : (
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Manage Categories</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setCategoryModalVisible(true)}
              >
                <Text style={styles.addButtonText}>+ Add Category</Text>
              </TouchableOpacity>
            </View>

            {categories.map(category => {
              const cardCount = flashcards.filter(card => card.category === category.name).length;
              return (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryHeader}>
                      <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <Text style={styles.categoryCount}>
                      {cardCount} flashcard{cardCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCategory(category.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Flashcard Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Add New Flashcard</Text>

                <Text style={styles.label}>Flashcard Type</Text>
                <View style={styles.typeSelector}>
                  {[
                    { type: 'text', label: 'Text', icon: '📝' },
                    { type: 'equation', label: 'Equation', icon: '🧮' }
                  ].map(({ type, label, icon }) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        flashcardType === type && styles.typeButtonSelected,
                      ]}
                      onPress={() => {
                        setFlashcardType(type);
                        if (type === 'text') {
                          setShowMathKeyboard(false);
                        }
                      }}
                    >
                      <Text style={styles.typeButtonIcon}>{icon}</Text>
                      <Text style={[
                        styles.typeButtonText,
                        flashcardType === type && styles.typeButtonTextSelected,
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* INLINE MATH KEYBOARD - Always works! */}
                {flashcardType === 'equation' && (
                  <View style={styles.mathKeyboardContainer}>
                    <TouchableOpacity
                      style={styles.mathKeyboardToggle}
                      onPress={() => setShowMathKeyboard(!showMathKeyboard)}
                    >
                      <Text style={styles.mathKeyboardToggleText}>
                        {showMathKeyboard ? '▼' : '▶'} Math Symbols
                      </Text>
                    </TouchableOpacity>

                    {showMathKeyboard && (
                      <View style={styles.mathKeyboardInline}>
                        {mathSymbols.map((group, index) => (
                          <View key={index} style={styles.symbolCategory}>
                            <Text style={styles.symbolCategoryTitle}>{group.category}</Text>
                            <View style={styles.symbolRow}>
                              {group.symbols.map((symbol, idx) => (
                                <TouchableOpacity
                                  key={idx}
                                  style={styles.symbolButton}
                                  onPress={() => insertSymbol(symbol)}
                                >
                                  <Text style={styles.symbolText}>{symbol}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryContainer}>
                    {categories.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryButton,
                          selectedCategory === cat.name && styles.categoryButtonSelected,
                          { borderColor: cat.color }
                        ]}
                        onPress={() => setSelectedCategory(cat.name)}
                      >
                        <Text style={[
                          styles.categoryButtonText,
                          selectedCategory === cat.name && styles.categoryButtonTextSelected,
                        ]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <Text style={styles.label}>Question</Text>
                <TextInput
                  style={[styles.input, flashcardType === 'equation' && styles.equationInput]}
                  value={question}
                  onChangeText={setQuestion}
                  onFocus={() => setActiveInput('question')}
                  placeholder={
                    flashcardType === 'equation' 
                      ? "e.g., What is the quadratic formula?"
                      : "Enter question"
                  }
                  multiline
                />

                <Text style={styles.label}>Answer</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline, flashcardType === 'equation' && styles.equationInput]}
                  value={answer}
                  onChangeText={setAnswer}
                  onFocus={() => setActiveInput('answer')}
                  placeholder={
                    flashcardType === 'equation'
                      ? "e.g., x = (-b ± √(b²-4ac)) / 2a"
                      : "Enter answer"
                  }
                  multiline
                  numberOfLines={4}
                />

                {flashcardType === 'equation' && (
                  <View style={styles.equationHelp}>
                    <Text style={styles.helpTitle}>💡 Quick Tips:</Text>
                    <Text style={styles.helpText}>• Tap "Math Symbols" above to show/hide symbols</Text>
                    <Text style={styles.helpText}>• Focus question or answer field first</Text>
                    <Text style={styles.helpText}>• Tap any symbol to insert it</Text>
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => {
                      setModalVisible(false);
                      setQuestion('');
                      setAnswer('');
                      setSelectedCategory('');
                      setFlashcardType('text');
                      setShowMathKeyboard(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonAdd]}
                    onPress={handleAddFlashcard}
                  >
                    <Text style={styles.modalButtonAddText}>Add Flashcard</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add Category Modal */}
      <Modal visible={categoryModalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Category</Text>

              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Enter category name"
              />

              <Text style={styles.label}>Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.colorPicker}>
                  {categoryColors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newCategoryColor === color && styles.colorOptionSelected
                      ]}
                      onPress={() => setNewCategoryColor(color)}
                    />
                  ))}
                </View>
              </ScrollView>

              <View style={styles.selectedColorPreview}>
                <View style={[styles.colorPreview, { backgroundColor: newCategoryColor }]} />
                <Text style={styles.selectedColorText}>Selected color</Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setCategoryModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonAdd]}
                  onPress={handleAddCategory}
                >
                  <Text style={styles.modalButtonAddText}>Add Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* AI Generation Modal */}
      <Modal visible={aiModalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🤖 AI Flashcard Generation</Text>

              <Text style={styles.label}>Topic</Text>
              <TextInput
                style={styles.input}
                value={aiTopic}
                onChangeText={setAiTopic}
                placeholder="e.g., Quantum Physics, Calculus, French Vocabulary"
              />

              <Text style={styles.label}>Number of Cards</Text>
              <View style={styles.numberSelector}>
                {[3, 5, 10].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      aiCardCount === num.toString() && styles.numberButtonSelected,
                    ]}
                    onPress={() => setAiCardCount(num.toString())}
                  >
                    <Text style={[
                      styles.numberButtonText,
                      aiCardCount === num.toString() && styles.numberButtonTextSelected,
                    ]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Difficulty Level</Text>
              <View style={styles.difficultySelector}>
                {['easy', 'medium', 'hard'].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyButton,
                      aiDifficulty === level && styles.difficultyButtonSelected,
                    ]}
                    onPress={() => setAiDifficulty(level)}
                  >
                    <Text style={[
                      styles.difficultyButtonText,
                      aiDifficulty === level && styles.difficultyButtonTextSelected,
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.aiExamples}>
                <Text style={styles.examplesTitle}>💡 Try these examples:</Text>
                {['Machine Learning', 'Spanish Verbs', 'Organic Chemistry', 'Calculus Derivatives'].map(example => (
                  <TouchableOpacity
                    key={example}
                    style={styles.exampleButton}
                    onPress={() => setAiTopic(example)}
                  >
                    <Text style={styles.exampleText}>{example}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setAiModalVisible(false)}
                  disabled={isGenerating}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonAdd]}
                  onPress={handleAiGeneration}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.modalButtonAddText}>Generate</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButtonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  addButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.success,
    borderRadius: 8,
  },
  addButtonPrimary: {
    backgroundColor: COLORS.success,
  },
  addButtonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyStateText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtext: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  aiSuggestionButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  aiSuggestionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: SIZES.xs,
    color: '#ffffff',
    fontWeight: '600',
  },
  cardTypeIcon: {
    fontSize: 16,
  },
  cardQuestion: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardAnswer: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  equationText: {
    fontFamily: 'monospace',
    fontSize: SIZES.md,
  },
  equationNote: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  categoryItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: SPACING.sm,
  },
  categoryName: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  categoryCount: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  equationInput: {
    fontFamily: 'monospace',
  },
  
  // INLINE MATH KEYBOARD STYLES - The solution!
  mathKeyboardContainer: {
    marginVertical: SPACING.sm,
  },
  mathKeyboardToggle: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  mathKeyboardToggleText: {
    color: '#ffffff',
    fontSize: SIZES.md,
    fontWeight: 'bold',
  },
  mathKeyboardInline: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  symbolCategory: {
    marginBottom: SPACING.md,
  },
  symbolCategoryTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
// ... (previous code continues)

  symbolRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  symbolButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonIcon: {
    fontSize: SIZES.md,
  },
  typeButtonText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeButtonTextSelected: {
    color: '#ffffff',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 2,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: SIZES.sm,
    color: COLORS.text,
  },
  categoryButtonTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  equationHelp: {
    backgroundColor: `${COLORS.primary}15`,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  helpTitle: {
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  helpText: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    lineHeight: 16,
    marginBottom: 2,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedColorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: SPACING.sm,
  },
  selectedColorText: {
    fontSize: SIZES.sm,
    color: COLORS.text,
  },
  numberSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.lg,
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
  aiExamples: {
    marginBottom: SPACING.lg,
  },
  examplesTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  exampleButton: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xs,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  exampleText: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.background,
  },
  modalButtonAdd: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalButtonAddText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ManageScreen;