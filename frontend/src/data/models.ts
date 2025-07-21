// AI Models data structure for the application
export interface ModelProvider {
  id: string;
  name: string;
}

export interface ModelPricing {
  prompt: string;
  completion: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: ModelPricing;
  provider: ModelProvider;
  icon?: string;
  maxTokens?: number;
  inputPrice?: number;
  outputPrice?: number;
}

export const availableModels: AIModel[] = [
  {
    id: 'openrouter/switchpoint-router',
    name: 'Switchpoint Router',
    description: 'Switchpoint AI routes instantly analyzes your request and directs it to the optimal AI from an ever-evolving library. At the word of LLMs advances, our router gets smarter, ensuring you always get the best response.',
    context_length: 162000,
    pricing: {
      prompt: '0.0',
      completion: '0.0'
    },
    provider: {
      id: 'switchpoint',
      name: 'Switchpoint'
    },
    icon: '🔄',
    maxTokens: 162000,
    inputPrice: 0.0,
    outputPrice: 0.0
  },
  {
    id: 'moonshot/moonshot-v1-8k',
    name: 'Moonshot-v1 8k',
    description: 'Kimi K2 is a large-scale Mixture-of-Experts (MoE) language model developed by Moonshot AI, featuring 1 trillion total parameters with 22 billion active per forward pass.',
    context_length: 380000,
    pricing: {
      prompt: '0.001',
      completion: '0.0015'
    },
    provider: {
      id: 'moonshot',
      name: 'Moonshot AI'
    },
    icon: '🌙',
    maxTokens: 380000,
    inputPrice: 0.001,
    outputPrice: 0.0015
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Google: Gemini Pro 1.5',
    description: 'Google\'s next-generation multimodal model, with a 1 million token context window, advanced multimodal reasoning, and a breakthrough in long-context understanding.',
    context_length: 1000000,
    pricing: {
      prompt: '0.0005',
      completion: '0.001'
    },
    provider: {
      id: 'google',
      name: 'Google'
    },
    icon: '✨',
    maxTokens: 1000000,
    inputPrice: 0.0005,
    outputPrice: 0.001
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Anthropic: Claude 3 Opus',
    description: 'Anthropic\'s most powerful model, delivering state-of-the-art performance, intelligence, and fluency on complex tasks. Ideal for enterprise-grade applications.',
    context_length: 200000,
    pricing: {
      prompt: '0.015',
      completion: '0.075'
    },
    provider: {
      id: 'anthropic',
      name: 'Anthropic'
    },
    icon: '🎭',
    maxTokens: 200000,
    inputPrice: 0.015,
    outputPrice: 0.075
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    description: 'Mistral Large is a high-performance vision-language model developed by Mistral AI. Positioned as a step-up from Devastral Medium.',
    context_length: 688000,
    pricing: {
      prompt: '0.0025',
      completion: '0.0075'
    },
    provider: {
      id: 'mistralai',
      name: 'Mistral AI'
    },
    icon: '🌊',
    maxTokens: 688000,
    inputPrice: 0.0025,
    outputPrice: 0.0075
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s most advanced multimodal model, capable of understanding text, audio, and images.',
    context_length: 128000,
    pricing: {
      prompt: '0.005',
      completion: '0.015'
    },
    provider: {
      id: 'openai',
      name: 'OpenAI'
    },
    icon: '🤖',
    maxTokens: 128000,
    inputPrice: 0.005,
    outputPrice: 0.015
  }
];

// Default model selection
export const defaultModel = availableModels[0];
