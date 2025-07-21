from django.db import models
from django.conf import settings
from marketplace.models import AIModel
import uuid


class Conversation(models.Model):
    """Chat conversations between users and AI models"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=200, blank=True)
    model = models.ForeignKey(AIModel, on_delete=models.CASCADE, related_name='conversations')
    
    # Conversation Settings
    system_prompt = models.TextField(blank=True, help_text="System prompt for the conversation")
    temperature = models.DecimalField(max_digits=3, decimal_places=2, default=0.7)
    max_tokens = models.IntegerField(default=2048)
    
    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def get_title(self):
        """Generate or return conversation title"""
        if self.title:
            return self.title
        
        first_message = self.messages.filter(role='user').first()
        if first_message:
            # Use first 50 characters of first user message as title
            return first_message.content[:50] + ("..." if len(first_message.content) > 50 else "")
        
        return f"Conversation with {self.model.display_name}"
    
    def get_message_count(self):
        """Get total number of messages in conversation"""
        return self.messages.count()
    
    def get_total_tokens(self):
        """Get total tokens used in this conversation"""
        return self.messages.aggregate(
            total=models.Sum('tokens_used')
        )['total'] or 0
    
    def get_total_cost(self):
        """Get total cost of this conversation"""
        return self.messages.aggregate(
            total=models.Sum('cost')
        )['total'] or 0
    
    def __str__(self):
        return self.get_title()


class Message(models.Model):
    """Individual messages within a conversation"""
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    
    # Metadata
    tokens_used = models.IntegerField(default=0)
    cost = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    response_time = models.DecimalField(max_digits=8, decimal_places=3, default=0, help_text="Response time in seconds")
    
    # Status and Error Handling
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    error_message = models.TextField(blank=True)
    
    # OpenRouter Metadata
    openrouter_id = models.CharField(max_length=100, blank=True, help_text="OpenRouter message/request ID")
    model_used = models.CharField(max_length=200, blank=True, help_text="Actual model used by OpenRouter")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."


class ChatSession(models.Model):
    """Temporary chat sessions for anonymous users"""
    
    session_id = models.CharField(max_length=100, unique=True)
    model = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    conversation_data = models.JSONField(default=list, help_text="Store messages for anonymous sessions")
    
    # Usage tracking for anonymous sessions
    total_requests = models.IntegerField(default=0)
    total_tokens = models.IntegerField(default=0)
    total_cost = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Anonymous session: {self.session_id}"
