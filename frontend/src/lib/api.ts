// API configuration and types for FereeLAB CMS backend integration

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API Response Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  daily_request_limit: number;
  monthly_request_limit: number;
  daily_cost_limit: number;
  monthly_cost_limit: number;
  preferred_model: string;
  theme_preference: 'light' | 'dark' | 'system';
  daily_usage: UsageInfo;
  monthly_usage: UsageInfo;
  can_make_request: {
    allowed: boolean;
    message: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UsageInfo {
  requests: number;
  cost: number;
  tokens: number;
}

// Model Types
export interface ModelProvider {
  id: number;
  name: string;
  display_name: string;
  description: string;
  website: string;
  logo_url: string;
  is_active: boolean;
}

export interface AIModel {
  id: number;
  model_id: string;
  name: string;
  display_name: string;
  provider: ModelProvider;
  description: string;
  category: string;
  context_length: number;
  max_output_tokens?: number;
  prompt_cost: number;
  completion_cost: number;
  quality_score: number;
  speed_score: number;
  popularity_score: number;
  supports_functions: boolean;
  supports_vision: boolean;
  supports_streaming: boolean;
  is_active: boolean;
  is_featured: boolean;
  estimated_cost: number;
  usage_stats: {
    total_requests: number;
    total_tokens: number;
    total_cost: number;
    avg_response_time: number;
    success_rate: number;
    last_used?: string;
  };
  created_at: string;
  updated_at: string;
}

// Chat Types
export interface Conversation {
  id: string;
  title: string;
  model: {
    id: number;
    model_id: string;
    display_name: string;
    provider_name: string;
  };
  system_prompt: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  message_count: number;
  total_tokens: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number;
  cost: number;
  response_time: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  openrouter_id?: string;
  model_used?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  model_id?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
}

export interface ChatResponse {
  success: boolean;
  message: Message;
  conversation: Conversation;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost: number;
  };
  error?: string;
}

// Usage Types
export interface UsageRecord {
  id: number;
  model: {
    id: number;
    model_id: string;
    display_name: string;
    provider_name: string;
  };
  request_type: string;
  prompt_tokens: number;
  completion_tokens: number;
  tokens_used: number;
  cost: number;
  prompt_cost: number;
  completion_cost: number;
  response_time: number;
  success: boolean;
  error_message?: string;
  openrouter_id?: string;
  actual_model?: string;
  created_at: string;
}

export interface UsageDashboard {
  today: UsageInfo;
  this_month: UsageInfo;
  limits: {
    daily_requests: number;
    monthly_requests: number;
    daily_cost: number;
    monthly_cost: number;
  };
  recent_activity: UsageRecord[];
  active_alerts: UsageAlert[];
  usage_trend: Array<{
    date: string;
    requests: number;
    cost: number;
    tokens: number;
  }>;
  top_models: Array<{
    model__display_name: string;
    model__model_id: string;
    requests: number;
    cost: number;
    tokens: number;
  }>;
}

export interface UsageAlert {
  id: number;
  alert_type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  threshold_value?: number;
  current_value?: number;
  is_read: boolean;
  is_active: boolean;
  created_at: string;
}

// API Client Class
class APIClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Ignore JSON parse errors for error responses
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; version: string }> {
    return this.request('/health/');
  }

  // User API
  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }): Promise<User> {
    return this.request('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials: {
    username: string;
    password: string;
  }): Promise<{ message: string; user: User }> {
    return this.request('/users/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getUserProfile(): Promise<User> {
    return this.request('/users/profile/');
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    return this.request('/users/profile/', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async getUserStats(): Promise<{
    daily_usage: UsageInfo;
    monthly_usage: UsageInfo;
    can_make_request: { allowed: boolean; message: string };
    conversation_count: number;
    api_key_count: number;
    limits: {
      daily_requests: number;
      monthly_requests: number;
      daily_cost: number;
      monthly_cost: number;
    };
  }> {
    return this.request('/users/stats/');
  }

  // Marketplace API
  async getModels(params?: {
    category?: string;
    provider?: string;
    supports_functions?: boolean;
    supports_vision?: boolean;
    featured?: boolean;
    search?: string;
  }): Promise<AIModel[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/marketplace/models/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getModel(modelId: string): Promise<AIModel> {
    return this.request(`/marketplace/models/${modelId}/`);
  }

  async getFeaturedModels(): Promise<{ featured_models: AIModel[] }> {
    return this.request('/marketplace/featured/');
  }

  async getModelCategories(): Promise<{ categories: string[] }> {
    return this.request('/marketplace/categories/');
  }

  async getMarketplaceStats(): Promise<{
    total_models: number;
    total_providers: number;
    categories: string[];
    featured_count: number;
  }> {
    return this.request('/marketplace/stats/');
  }

  // Chat API
  async getConversations(): Promise<Conversation[]> {
    return this.request('/chat/conversations/');
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    return this.request(`/chat/conversations/${conversationId}/`);
  }

  async createConversation(data: {
    title?: string;
    model_id: string;
    system_prompt?: string;
    temperature?: number;
    max_tokens?: number;
  }): Promise<Conversation> {
    return this.request('/chat/conversations/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
    return this.request('/chat/chat/', {
      method: 'POST',
      body: JSON.stringify(chatRequest),
    });
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return this.request(`/chat/conversations/${conversationId}/messages/`);
  }

  async regenerateMessage(messageId: string): Promise<Message> {
    return this.request(`/chat/messages/${messageId}/regenerate/`, {
      method: 'POST',
    });
  }

  async deleteConversation(conversationId: string): Promise<{ message: string }> {
    return this.request(`/chat/conversations/${conversationId}/delete/`, {
      method: 'DELETE',
    });
  }

  // Usage API
  async getUsageDashboard(): Promise<UsageDashboard> {
    return this.request('/usage/dashboard/');
  }

  async getUsageRecords(params?: {
    start_date?: string;
    end_date?: string;
    model?: string;
    success?: boolean;
  }): Promise<UsageRecord[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/usage/records/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getUsageQuotas(): Promise<{
    daily: {
      requests: { used: number; limit: number; percentage: number };
      cost: { used: number; limit: number; percentage: number };
    };
    monthly: {
      requests: { used: number; limit: number; percentage: number };
      cost: { used: number; limit: number; percentage: number };
    };
  }> {
    return this.request('/usage/quotas/');
  }

  async getUsageAlerts(params?: {
    active_only?: boolean;
    unread_only?: boolean;
  }): Promise<UsageAlert[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/usage/alerts/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async markAlertRead(alertId: number): Promise<{ message: string }> {
    return this.request(`/usage/alerts/${alertId}/read/`, {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export individual API functions for convenience
export const api = {
  // Health
  healthCheck: () => apiClient.healthCheck(),
  
  // Users
  register: (userData: Parameters<typeof apiClient.registerUser>[0]) => 
    apiClient.registerUser(userData),
  login: (credentials: Parameters<typeof apiClient.loginUser>[0]) => 
    apiClient.loginUser(credentials),
  getProfile: () => apiClient.getUserProfile(),
  updateProfile: (userData: Parameters<typeof apiClient.updateUserProfile>[0]) => 
    apiClient.updateUserProfile(userData),
  getUserStats: () => apiClient.getUserStats(),
  
  // Marketplace
  getModels: (params?: Parameters<typeof apiClient.getModels>[0]) => 
    apiClient.getModels(params),
  getModel: (modelId: string) => apiClient.getModel(modelId),
  getFeaturedModels: () => apiClient.getFeaturedModels(),
  getModelCategories: () => apiClient.getModelCategories(),
  getMarketplaceStats: () => apiClient.getMarketplaceStats(),
  
  // Chat
  getConversations: () => apiClient.getConversations(),
  getConversation: (id: string) => apiClient.getConversation(id),
  createConversation: (data: Parameters<typeof apiClient.createConversation>[0]) => 
    apiClient.createConversation(data),
  sendMessage: (request: ChatRequest) => apiClient.sendMessage(request),
  getMessages: (conversationId: string) => apiClient.getConversationMessages(conversationId),
  regenerateMessage: (messageId: string) => apiClient.regenerateMessage(messageId),
  deleteConversation: (id: string) => apiClient.deleteConversation(id),
  
  // Usage
  getUsageDashboard: () => apiClient.getUsageDashboard(),
  getUsageRecords: (params?: Parameters<typeof apiClient.getUsageRecords>[0]) => 
    apiClient.getUsageRecords(params),
  getUsageQuotas: () => apiClient.getUsageQuotas(),
  getUsageAlerts: (params?: Parameters<typeof apiClient.getUsageAlerts>[0]) => 
    apiClient.getUsageAlerts(params),
  markAlertRead: (alertId: number) => apiClient.markAlertRead(alertId),
};