export const AI_PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini',
  GROQ: 'groq',
  HUGGINGFACE: 'huggingface',
  MISTRAL: 'mistral',
  TOGETHER: 'together',
  OLLAMA: 'ollama'
};

export const PROVIDER_CONFIGS = {
  [AI_PROVIDERS.OPENAI]: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    requiresKey: true,
    baseUrl: 'https://api.openai.com/v1'
  },
  [AI_PROVIDERS.GEMINI]: {
    name: 'Google Gemini',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    requiresKey: true,
    baseUrl: 'https://generativelanguage.googleapis.com'
  },
  [AI_PROVIDERS.GROQ]: {
    name: 'Groq',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    requiresKey: true,
    baseUrl: 'https://api.groq.com/openai/v1'
  },
  [AI_PROVIDERS.HUGGINGFACE]: {
    name: 'Hugging Face',
    models: ['microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill', 'microsoft/DialoGPT-medium'],
    requiresKey: true,
    baseUrl: 'https://api-inference.huggingface.co'
  },
  [AI_PROVIDERS.MISTRAL]: {
    name: 'Mistral AI',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    requiresKey: true,
    baseUrl: 'https://api.mistral.ai'
  },
  [AI_PROVIDERS.TOGETHER]: {
    name: 'Together AI',
    models: ['meta-llama/Llama-2-70b-chat-hf', 'meta-llama/Llama-2-13b-chat-hf', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
    requiresKey: true,
    baseUrl: 'https://api.together.xyz'
  },
  [AI_PROVIDERS.OLLAMA]: {
    name: 'Ollama (Local)',
    models: ['llama3.1', 'mistral', 'codellama', 'phi3'],
    requiresKey: false,
    baseUrl: 'http://localhost:11434'
  }
};