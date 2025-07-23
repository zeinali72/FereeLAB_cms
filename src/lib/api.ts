import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000,
  withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Add any default headers or auth tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        console.log('Unauthorized request, redirecting to login');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signup: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
};

// Chat API functions
export const chatAPI = {
  sendMessage: async (data: {
    messages: Array<{ role: string; content: string }>;
    model?: any;
    stream?: boolean;
  }) => {
    const response = await api.post('/api/chat', data);
    return response.data;
  },
  
  sendMessageStream: async (data: {
    messages: Array<{ role: string; content: string }>;
    model?: any;
  }) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        stream: true,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response;
  },
  
  getChatHistory: async (params?: { limit?: number; offset?: number }) => {
    const response = await api.get('/api/chat/history', { params });
    return response.data;
  },
  
  createChat: async (data: {
    title?: string;
    messages: Array<{ role: string; content: string; timestamp?: Date }>;
    model?: any;
  }) => {
    const response = await api.post('/api/chat/history', data);
    return response.data;
  },
  
  updateChat: async (data: {
    chatId: string;
    title?: string;
    messages?: Array<{ role: string; content: string; timestamp?: Date }>;
    model?: any;
  }) => {
    const response = await api.put('/api/chat/history', data);
    return response.data;
  },
  
  deleteChat: async (chatId: string) => {
    const response = await api.delete(`/api/chat/history?chatId=${chatId}`);
    return response.data;
  },
};

// Models API functions
export const modelsAPI = {
  getModels: async () => {
    const response = await api.get('/api/models');
    return response.data;
  },
};

// Utility function for handling streaming responses
export const handleStreamingResponse = async (
  response: Response,
  onChunk: (chunk: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
) => {
  try {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('No reader available');
    }
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete?.();
        break;
      }
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            onComplete?.();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
            console.warn('Failed to parse SSE data:', data);
          }
        }
      }
    }
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error('Unknown error'));
  }
};

export default api;