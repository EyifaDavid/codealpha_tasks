// components/EnhancedFlashcard.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/themes';
// import MathJax from 'react-native-mathjax';

export const FlashCard = ({ card }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;


  if (!card) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.cardFront]}>
          <Text style={styles.errorText}>No card data available</Text>
        </View>
      </View>
    );
  }

  const safeCard = {
    category: card.category || 'Uncategorized',
    question: card.question || 'No question available',
    answer: card.answer || 'No answer available',
    type: card.type || 'text',
    imageUri: card.imageUri || null,
  };

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: showAnswer ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      setShowAnswer(!showAnswer);
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  // Simple equation formatter (no MathJax for now)
  const formatEquation = (text) => {
    if (!text) return 'No content';
    
    // Basic LaTeX to readable text conversions
    return text
      .replace(/\$\$(.*?)\$\$/g, '$1') // Remove display math delimiters
      .replace(/\$(.*?)\$/g, '$1') // Remove inline math delimiters
      .replace(/\\frac{(.*?)}{(.*?)}/g, '($1)/($2)') // Fractions
      .replace(/\\sqrt{(.*?)}/g, '√($1)') // Square roots
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\^(\d+)/g, '^$1') // Keep superscript
      .replace(/_(\d+)/g, '_$1'); // Keep subscript
  };

  const renderContent = (isAnswer) => {
    const content = isAnswer ? safeCard.answer : safeCard.question;
    
    if (!content) {
      return (
        <Text style={styles.errorText}>
          No {isAnswer ? 'answer' : 'question'} available
        </Text>
      );
    }

    // Check if it's an equation (either by type or by containing $)
    const isEquation = safeCard.type === 'equation' || content.includes('$');

    if (isEquation) {
      return (
        <View style={styles.equationContainer}>
          <Text style={styles.equationText}>
            {formatEquation(content)}
          </Text>
          <Text style={styles.equationNote}>
            Equation Card
          </Text>
        </View>
      );
    }

    if (safeCard.type === 'image' && safeCard.imageUri) {
      return (
        <Image 
          source={{ uri: safeCard.imageUri }} 
          style={styles.image}
          resizeMode="contain"
        />
      );
    }

    return (
      <Text style={isAnswer ? styles.answerText : styles.questionText}>
        {content}
      </Text>
    );
  };

  const getTypeBadgeText = () => {
    const type = safeCard.type || 'text';
    switch (type) {
      case 'equation': return 'EQUATION';
      case 'image': return 'IMAGE';
      default: return 'TEXT';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
        <View style={styles.cardContainer}>
          {/* Front Side */}
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
            <Text style={styles.category}>{safeCard.category}</Text>
            <View style={styles.content}>
              {renderContent(false)}
              <Text style={styles.hint}>Tap to flip</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {getTypeBadgeText()}
              </Text>
            </View>
          </Animated.View>

          {/* Back Side */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Text style={styles.category}>{safeCard.category}</Text>
            <View style={styles.content}>
              {renderContent(true)}
              <Text style={styles.hint}>Tap to flip</Text>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  cardContainer: {
    width: Dimensions.get('window').width - 40,
    height: 400,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: SPACING.lg,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: COLORS.card,
  },
  cardBack: {
    backgroundColor: '#f8fafc',
  },
  category: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  answerText: {
    fontSize: SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  equationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  equationText: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: 'System',
  },
  equationNote: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  hint: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: SPACING.lg,
  },
  typeBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: SIZES.xs,
    color: '#ffffff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: SIZES.md,
    color: COLORS.error || '#ff6b6b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});