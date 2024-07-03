import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import Svg, { Circle, Path } from "react-native-svg"
import { OPENAI_API_KEY } from './config';
import { OPENAI_API_PROMPT } from './prompt';
import "expo-router/entry";

const App = () => {
  const [completion, setCompletion] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (input.trim() === '') return;

    setLoading(true);
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', OPENAI_API_PROMPT(input), {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      setCompletion(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching completion:', error);
    }
    setLoading(false);
  };

  return  (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Svg xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={64}
          fill="none"
        >
        <Circle cx={32} cy={16} r={12} fill="orange" />
        <Path
          fill="orange"
          d="M32 28c-9.4 0-16 7.6-16 17v11h32V45c0-9.4-6.6-17-16-17ZM16 56h32v4H16z"
        />
        </Svg>

        <Text style={styles.title}>Who is the lucky starter?</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your prompt here"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#FFA500" />
        ) : completion ? (
          <View style={styles.completionContainer}>
            <Text style={styles.completion}>{completion}</Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}></Text>
        )}
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fffaf0'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 20,
    fontFamily: 'Avenir',
  },
  input: {
    height: 40,
    borderColor: '#FFA500',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 10,
    fontFamily: 'Avenir',
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
  },
  completionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  completion: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Avenir',
  }
});

export default App;
