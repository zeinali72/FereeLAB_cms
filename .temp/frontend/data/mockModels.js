// frontend/data/mockModels.js
export const mockModels = [
  {
    id: 'openrouter/switchpoint-router',
    name: 'Switchpoint Router',
    description: 'Switchpoint AI routes instantly analyzes your request and directs it to the optimal AI from an ever-evolving library. At the word of LLMs advances, our router gets smarter, ensuring you always...',
    context_length: 162000,
    pricing: {
      prompt: '0.0',
      completion: '0.0'
    },
    provider: {
      id: 'switchpoint',
      name: 'Switchpoint'
    }
  },
  {
    id: 'moonshot/moonshot-v1-8k',
    name: 'Moonshot-v1 8k',
    description: 'Kimi K2 is a large-scale Mixture-of-Experts (MoE) language model developed by Moonshot AI, featuring 1 trillion total parameters with 22 billion active per forward pass. It\'s optimized for agent...',
    context_length: 380000,
    pricing: {
      prompt: '0.001',
      completion: '0.0015'
    },
    provider: {
      id: 'moonshot',
      name: 'Moonshot AI'
    }
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Google: Gemini Pro 1.5',
    description: 'Googles next-generation multimodal model, with a 1 million token context window, advanced multimodal reasoning, and a breakthrough in long-context understanding.',
    context_length: 1000000,
    pricing: {
      prompt: '0.0005',
      completion: '0.001'
    },
    provider: {
      id: 'google',
      name: 'Google'
    }
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
    }
  },
    {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    description: 'Mistral Large is a high-performance vision-language model developed by Mistral AI. Positioned as a step-up from Devastral Medium, it achieves 6.8...',
    context_length: 688000,
    pricing: {
        prompt: '0.0025',
        completion: '0.0075'
    },
    provider: {
        id: 'mistralai',
        name: 'Mistral AI'
    }
  },
];