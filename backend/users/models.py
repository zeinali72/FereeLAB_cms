from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    """Extended user model with API key management and usage tracking"""
    
    # API Key Management
    openrouter_api_key = models.CharField(max_length=255, blank=True, null=True)
    api_key_verified = models.BooleanField(default=False)
    api_key_last_verified = models.DateTimeField(blank=True, null=True)
    
    # Usage Limits and Quotas
    daily_request_limit = models.IntegerField(default=100)
    monthly_request_limit = models.IntegerField(default=3000)
    daily_cost_limit = models.DecimalField(max_digits=10, decimal_places=4, default=10.0000)
    monthly_cost_limit = models.DecimalField(max_digits=10, decimal_places=4, default=300.0000)
    
    # User Preferences
    preferred_model = models.CharField(max_length=100, default='switchpoint/openrouter-4b')
    theme_preference = models.CharField(
        max_length=10, 
        choices=[('light', 'Light'), ('dark', 'Dark'), ('system', 'System')], 
        default='system'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_daily_usage(self):
        """Get today's usage statistics"""
        from usage.models import UsageRecord
        today = timezone.now().date()
        today_usage = UsageRecord.objects.filter(
            user=self,
            created_at__date=today
        ).aggregate(
            total_requests=models.Count('id'),
            total_cost=models.Sum('cost'),
            total_tokens=models.Sum('tokens_used')
        )
        return {
            'requests': today_usage['total_requests'] or 0,
            'cost': float(today_usage['total_cost'] or 0),
            'tokens': today_usage['total_tokens'] or 0
        }
    
    def get_monthly_usage(self):
        """Get this month's usage statistics"""
        from usage.models import UsageRecord
        month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_usage = UsageRecord.objects.filter(
            user=self,
            created_at__gte=month_start
        ).aggregate(
            total_requests=models.Count('id'),
            total_cost=models.Sum('cost'),
            total_tokens=models.Sum('tokens_used')
        )
        return {
            'requests': monthly_usage['total_requests'] or 0,
            'cost': float(monthly_usage['total_cost'] or 0),
            'tokens': monthly_usage['total_tokens'] or 0
        }
    
    def can_make_request(self):
        """Check if user can make another request based on limits"""
        daily_usage = self.get_daily_usage()
        monthly_usage = self.get_monthly_usage()
        
        if daily_usage['requests'] >= self.daily_request_limit:
            return False, "Daily request limit exceeded"
        
        if monthly_usage['requests'] >= self.monthly_request_limit:
            return False, "Monthly request limit exceeded"
        
        if daily_usage['cost'] >= float(self.daily_cost_limit):
            return False, "Daily cost limit exceeded"
        
        if monthly_usage['cost'] >= float(self.monthly_cost_limit):
            return False, "Monthly cost limit exceeded"
        
        return True, "OK"
    
    def __str__(self):
        return self.username


class UserAPIKey(models.Model):
    """Store and manage user API keys securely"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(max_length=100, help_text="Name for this API key")
    api_key = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    last_used = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"
