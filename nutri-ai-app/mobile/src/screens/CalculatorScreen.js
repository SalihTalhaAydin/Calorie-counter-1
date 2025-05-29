import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { calculateNutrition, selectNutritionState } from '../store/nutritionSlice';
import NutritionCard from '../components/NutritionCard';
import ModelSelector from '../components/ModelSelector';

export default function CalculatorScreen() {
  const [foodInput, setFoodInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  
  const dispatch = useDispatch();
  const { loading, lastResult, error } = useSelector(selectNutritionState);

  const handleCalculate = async () => {
    if (!foodInput.trim()) {
      Alert.alert('Error', 'Please enter a food description');
      return;
    }

    try {
      await dispatch(calculateNutrition({
        food: foodInput.trim(),
        model: selectedModel
      })).unwrap();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to calculate nutrition');
    }
  };

  const handleExampleSelect = (example) => {
    setFoodInput(example);
  };

  const examples = [
    'wendys daves single and no mayo and lettuce instead of the buns',
    'mcdonalds big mac no pickles',
    '6 oz grilled chicken breast with steamed broccoli',
    'chipotle chicken bowl white rice black beans no cheese'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>ÌΩé AI Nutrition Calculator</Text>
          <Text style={styles.subtitle}>Get accurate nutrition data with AI</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Food Description</Text>
          <TextInput
            style={styles.textInput}
            value={foodInput}
            onChangeText={setFoodInput}
            placeholder="e.g., wendys daves single and no mayo and lettuce instead of the buns"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <ModelSelector
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
          />

          <TouchableOpacity
            style={[styles.calculateButton, loading && styles.buttonDisabled]}
            onPress={handleCalculate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.calculateButtonText}>Calculate Nutrition</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.examplesSection}>
          <Text style={styles.sectionTitle}>Quick Examples</Text>
          {examples.map((example, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleButton}
              onPress={() => handleExampleSelect(example)}
            >
              <Text style={styles.exampleText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>‚ùå {error}</Text>
          </View>
        )}

        {lastResult && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Nutrition Results</Text>
            <NutritionCard result={lastResult} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  calculateButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  examplesSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  exampleButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  exampleText: {
    fontSize: 14,
    color: '#475569',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  resultSection: {
    marginBottom: 30,
  },
});
