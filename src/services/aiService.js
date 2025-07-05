import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';
import { MistralAI } from '@mistralai/mistralai';
import axios from 'axios';
import { AI_PROVIDERS } from '../config/aiProviders';

class AIService {
  constructor() {
    this.clients = {};
  }

  initializeClient(provider, apiKey, baseUrl = null) {
    switch (provider) {
      case AI_PROVIDERS.OPENAI:
        this.clients[provider] = new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: true
        });
        break;
      
      case AI_PROVIDERS.GEMINI:
        this.clients[provider] = new GoogleGenerativeAI(apiKey);
        break;
      
      case AI_PROVIDERS.GROQ:
        this.clients[provider] = new Groq({
          apiKey,
          dangerouslyAllowBrowser: true
        });
        break;
      
      case AI_PROVIDERS.HUGGINGFACE:
        this.clients[provider] = new HfInference(apiKey);
        break;
      
      case AI_PROVIDERS.MISTRAL:
        this.clients[provider] = new MistralAI({
          apiKey
        });
        break;
      
      case AI_PROVIDERS.TOGETHER:
      case AI_PROVIDERS.OLLAMA:
        this.clients[provider] = axios.create({
          baseURL: baseUrl || (provider === AI_PROVIDERS.OLLAMA ? 'http://localhost:11434' : 'https://api.together.xyz'),
          headers: provider === AI_PROVIDERS.TOGETHER ? {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        });
        break;
    }
  }

  async sendMessage(provider, model, messages, apiKey) {
    if (!this.clients[provider] && provider !== AI_PROVIDERS.OLLAMA) {
      this.initializeClient(provider, apiKey);
    }

    try {
      switch (provider) {
        case AI_PROVIDERS.OPENAI:
          return await this.handleOpenAI(model, messages);
        
        case AI_PROVIDERS.GEMINI:
          return await this.handleGemini(model, messages);
        
        case AI_PROVIDERS.GROQ:
          return await this.handleGroq(model, messages);
        
        case AI_PROVIDERS.HUGGINGFACE:
          return await this.handleHuggingFace(model, messages);
        
        case AI_PROVIDERS.MISTRAL:
          return await this.handleMistral(model, messages);
        
        case AI_PROVIDERS.TOGETHER:
          return await this.handleTogether(model, messages, apiKey);
        
        case AI_PROVIDERS.OLLAMA:
          return await this.handleOllama(model, messages);
        
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error with ${provider}:`, error);
      throw error;
    }
  }

  async handleOpenAI(model, messages) {
    const response = await this.clients[AI_PROVIDERS.OPENAI].chat.completions.create({
      model,
      messages,
      stream: false
    });
    return response.choices[0].message.content;
  }

  async handleGemini(model, messages) {
    const genAI = this.clients[AI_PROVIDERS.GEMINI];
    const geminiModel = genAI.getGenerativeModel({ model });
    
    const lastMessage = messages[messages.length - 1];
    const result = await geminiModel.generateContent(lastMessage.content);
    const response = await result.response;
    return response.text();
  }

  async handleGroq(model, messages) {
    const response = await this.clients[AI_PROVIDERS.GROQ].chat.completions.create({
      model,
      messages,
      stream: false
    });
    return response.choices[0].message.content;
  }

  async handleHuggingFace(model, messages) {
    const lastMessage = messages[messages.length - 1];
    const response = await this.clients[AI_PROVIDERS.HUGGINGFACE].textGeneration({
      model,
      inputs: lastMessage.content,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7
      }
    });
    return response.generated_text;
  }

  async handleMistral(model, messages) {
    const response = await this.clients[AI_PROVIDERS.MISTRAL].chat.complete({
      model,
      messages
    });
    return response.choices[0].message.content;
  }

  async handleTogether(model, messages, apiKey) {
    const response = await this.clients[AI_PROVIDERS.TOGETHER].post('/v1/chat/completions', {
      model,
      messages,
      max_tokens: 500,
      temperature: 0.7
    });
    return response.data.choices[0].message.content;
  }

  async handleOllama(model, messages) {
    if (!this.clients[AI_PROVIDERS.OLLAMA]) {
      this.initializeClient(AI_PROVIDERS.OLLAMA, null);
    }
    
    const lastMessage = messages[messages.length - 1];
    const response = await this.clients[AI_PROVIDERS.OLLAMA].post('/api/generate', {
      model,
      prompt: lastMessage.content,
      stream: false
    });
    return response.data.response;
  }
}

export const aiService = new AIService();