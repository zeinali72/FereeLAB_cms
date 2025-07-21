from django.db import models
from django.conf import settings
from marketplace.models import AIModel
from datetime import datetime, timedelta
from django.utils import timezone


class UsageRecord(models.Model):
    """Track individual API usage records"""
    
    REQUEST_TYPES = [
        ('chat', 'Chat Completion'),
        ('completion', 'Text Completion'),
        ('image', 'Image Generation'),
        ('embedding', 'Embedding'),
        ('moderation', 'Content Moderation'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='usage_records')
    model = models.ForeignKey(AIModel, on_delete=models.CASCADE, related_name='usage_records')
    
    # Request Details
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPES, default='chat')
    prompt_tokens = models.IntegerField(default=0)
    completion_tokens = models.IntegerField(default=0)
    tokens_used = models.IntegerField(default=0)  # Total tokens
    
    # Cost Calculation
    cost = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    prompt_cost = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    completion_cost = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    
    # Performance Metrics
    response_time = models.DecimalField(max_digits=8, decimal_places=3, default=0, help_text="Response time in seconds")
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    
    # OpenRouter Metadata
    openrouter_id = models.CharField(max_length=100, blank=True)
    actual_model = models.CharField(max_length=200, blank=True, help_text="Actual model used by OpenRouter")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['model', 'created_at']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.model.display_name} - {self.created_at}"


class DailyUsageSummary(models.Model):
    """Daily usage summary for efficient querying"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='daily_summaries')
    date = models.DateField()
    
    # Aggregated Metrics
    total_requests = models.IntegerField(default=0)
    total_tokens = models.IntegerField(default=0)
    total_cost = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    
    # Model Breakdown (JSON field for flexibility)
    models_used = models.JSONField(default=dict, help_text="Model usage breakdown")
    
    # Performance Metrics
    avg_response_time = models.DecimalField(max_digits=8, decimal_places=3, default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date}"


class MonthlyUsageSummary(models.Model):
    """Monthly usage summary for billing and reporting"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='monthly_summaries')
    year = models.IntegerField()
    month = models.IntegerField()
    
    # Aggregated Metrics
    total_requests = models.IntegerField(default=0)
    total_tokens = models.IntegerField(default=0)
    total_cost = models.DecimalField(max_digits=12, decimal_places=4, default=0)
    
    # Daily Breakdown
    daily_breakdown = models.JSONField(default=dict, help_text="Daily usage breakdown")
    
    # Model Usage
    models_used = models.JSONField(default=dict, help_text="Model usage breakdown")
    
    # Performance Metrics
    avg_response_time = models.DecimalField(max_digits=8, decimal_places=3, default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'year', 'month']
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"{self.user.username} - {self.year}-{self.month:02d}"


class UsageAlert(models.Model):
    """Usage alerts and notifications"""
    
    ALERT_TYPES = [
        ('daily_limit', 'Daily Limit Warning'),
        ('monthly_limit', 'Monthly Limit Warning'),
        ('cost_limit', 'Cost Limit Warning'),
        ('quota_exceeded', 'Quota Exceeded'),
        ('api_error', 'API Error'),
    ]
    
    SEVERITY_LEVELS = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='usage_alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS, default='info')
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    threshold_value = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    current_value = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
