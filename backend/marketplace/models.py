from django.db import models
from django.utils import timezone


class ModelProvider(models.Model):
    """AI Model providers like OpenAI, Anthropic, Google, etc."""
    
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    logo_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.display_name


class AIModel(models.Model):
    """AI Models available in the marketplace"""
    
    CATEGORY_CHOICES = [
        ('chat', 'Chat'),
        ('completion', 'Completion'),
        ('image', 'Image Generation'),
        ('embedding', 'Embedding'),
        ('moderation', 'Moderation'),
    ]
    
    # Basic Information
    model_id = models.CharField(max_length=200, unique=True, help_text="OpenRouter model ID")
    name = models.CharField(max_length=200)
    display_name = models.CharField(max_length=200)
    provider = models.ForeignKey(ModelProvider, on_delete=models.CASCADE, related_name='models')
    
    # Model Details
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='chat')
    context_length = models.IntegerField(help_text="Maximum context length in tokens")
    max_output_tokens = models.IntegerField(blank=True, null=True)
    
    # Pricing (per 1M tokens)
    prompt_cost = models.DecimalField(max_digits=10, decimal_places=6, help_text="Cost per 1M input tokens")
    completion_cost = models.DecimalField(max_digits=10, decimal_places=6, help_text="Cost per 1M output tokens")
    
    # Performance Metrics
    quality_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, help_text="Quality score out of 10")
    speed_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, help_text="Speed score out of 10")
    popularity_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, help_text="Popularity score out of 10")
    
    # Capabilities
    supports_functions = models.BooleanField(default=False)
    supports_vision = models.BooleanField(default=False)
    supports_streaming = models.BooleanField(default=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-popularity_score', 'name']
    
    def get_estimated_cost(self, input_tokens, output_tokens):
        """Calculate estimated cost for a request"""
        input_cost = (input_tokens / 1_000_000) * float(self.prompt_cost)
        output_cost = (output_tokens / 1_000_000) * float(self.completion_cost)
        return input_cost + output_cost
    
    def __str__(self):
        return f"{self.provider.display_name} - {self.display_name}"


class ModelUsageStats(models.Model):
    """Track usage statistics for each model"""
    
    model = models.OneToOneField(AIModel, on_delete=models.CASCADE, related_name='usage_stats')
    total_requests = models.IntegerField(default=0)
    total_tokens = models.BigIntegerField(default=0)
    total_cost = models.DecimalField(max_digits=12, decimal_places=6, default=0)
    last_used = models.DateTimeField(blank=True, null=True)
    
    # Performance metrics (last 30 days)
    avg_response_time = models.DecimalField(max_digits=8, decimal_places=3, default=0, help_text="Average response time in seconds")
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=100.00, help_text="Success rate percentage")
    
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Stats for {self.model.display_name}"
