"""
OpenRouter API Service for handling chat completions and model interactions
"""

import requests
import json
import time
from typing import Dict, List, Optional, Tuple
from decimal import Decimal
from django.conf import settings
from marketplace.models import AIModel


class OpenRouterService:
    """Service class for interacting with OpenRouter API"""
    
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = settings.OPENROUTER_BASE_URL
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': settings.FRONTEND_URL,
            'X-Title': 'FereeLAB CMS'
        }
    
    def get_models(self) -> List[Dict]:
        """Fetch available models from OpenRouter"""
        try:
            response = requests.get(
                f"{self.base_url}/models",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return data.get('data', [])
        except requests.RequestException as e:
            print(f"Error fetching models: {e}")
            return []
    
    def chat_completion(self, model_id: str, messages: List[Dict], 
                       temperature: float = 0.7, max_tokens: int = 2048,
                       stream: bool = False) -> Tuple[Optional[Dict], Optional[str]]:
        """
        Send chat completion request to OpenRouter
        
        Returns:
            Tuple of (response_data, error_message)
        """
        
        # Check if this is a demo/provisional key
        if self.api_key == 'sk-or-v1-provisional-demo-key-for-testing':
            return self._mock_chat_completion(model_id, messages, temperature, max_tokens)
        
        try:
            payload = {
                'model': model_id,
                'messages': messages,
                'temperature': temperature,
                'max_tokens': max_tokens,
                'stream': stream
            }
            
            start_time = time.time()
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=60
            )
            response_time = time.time() - start_time
            
            response.raise_for_status()
            data = response.json()
            
            # Add response time to data
            data['response_time'] = response_time
            
            return data, None
            
        except requests.RequestException as e:
            error_msg = f"OpenRouter API error: {str(e)}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg = error_data.get('error', {}).get('message', str(e))
                except:
                    pass
            
            return None, error_msg
    
    def _mock_chat_completion(self, model_id: str, messages: List[Dict], 
                            temperature: float, max_tokens: int) -> Tuple[Dict, None]:
        """
        Mock chat completion for demo/testing purposes
        """
        import random
        
        # Simulate processing time
        time.sleep(random.uniform(0.5, 2.0))
        
        # Get last user message
        user_message = ""
        for msg in reversed(messages):
            if msg.get('role') == 'user':
                user_message = msg.get('content', '')
                break
        
        # Generate mock responses based on content
        mock_responses = [
            f"I understand you're asking about: '{user_message[:50]}...'. This is a demo response from {model_id}.",
            f"Thank you for your question. As {model_id}, I can help you with that. This is a demonstration of the OpenRouter integration.",
            f"Based on your query about '{user_message[:30]}...', here's a sample response showing the chat functionality works.",
            f"Hello! I'm responding as {model_id}. This demonstrates the real-time chat integration with the backend API."
        ]
        
        response_content = random.choice(mock_responses)
        
        # Estimate token usage
        prompt_tokens = sum(len(msg.get('content', '').split()) for msg in messages) * 1.3  # Rough estimation
        completion_tokens = len(response_content.split()) * 1.3
        total_tokens = int(prompt_tokens + completion_tokens)
        
        return {
            'id': f'chatcmpl-demo-{int(time.time())}',
            'object': 'chat.completion',
            'created': int(time.time()),
            'model': model_id,
            'choices': [{
                'index': 0,
                'message': {
                    'role': 'assistant',
                    'content': response_content
                },
                'finish_reason': 'stop'
            }],
            'usage': {
                'prompt_tokens': int(prompt_tokens),
                'completion_tokens': int(completion_tokens),
                'total_tokens': total_tokens
            },
            'response_time': random.uniform(0.5, 2.0)
        }, None
    
    def count_tokens(self, text: str) -> int:
        """
        Estimate token count for text
        (Simple approximation - in production, use tiktoken or similar)
        """
        # Rough approximation: 1 token ≈ 4 characters for English text
        return int(len(text) / 4)
    
    def calculate_cost(self, model_id: str, prompt_tokens: int, completion_tokens: int) -> Decimal:
        """Calculate cost for a request based on model pricing"""
        try:
            model = AIModel.objects.get(model_id=model_id)
            
            prompt_cost = (Decimal(prompt_tokens) / 1_000_000) * model.prompt_cost
            completion_cost = (Decimal(completion_tokens) / 1_000_000) * model.completion_cost
            
            return prompt_cost + completion_cost
        
        except AIModel.DoesNotExist:
            # Fallback pricing if model not found
            return Decimal('0.0001')  # Very small cost for demo
    
    def verify_api_key(self, api_key: str) -> Tuple[bool, str]:
        """Verify if an API key is valid"""
        if api_key == 'sk-or-v1-provisional-demo-key-for-testing':
            return True, "Demo key verified"
        
        try:
            headers = {**self.headers, 'Authorization': f'Bearer {api_key}'}
            response = requests.get(
                f"{self.base_url}/models",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return True, "API key verified"
            else:
                return False, f"API key verification failed: {response.status_code}"
        
        except requests.RequestException as e:
            return False, f"Verification error: {str(e)}"


# Global service instance
openrouter_service = OpenRouterService()