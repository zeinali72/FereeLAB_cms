from rest_framework import serializers
from .models import UsageRecord, DailyUsageSummary, MonthlyUsageSummary, UsageAlert
from marketplace.serializers import AIModelListSerializer


class UsageRecordSerializer(serializers.ModelSerializer):
    model = AIModelListSerializer(read_only=True)
    
    class Meta:
        model = UsageRecord
        fields = [
            'id', 'model', 'request_type', 'prompt_tokens', 'completion_tokens',
            'tokens_used', 'cost', 'prompt_cost', 'completion_cost',
            'response_time', 'success', 'error_message', 'openrouter_id',
            'actual_model', 'created_at'
        ]


class DailyUsageSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyUsageSummary
        fields = [
            'date', 'total_requests', 'total_tokens', 'total_cost',
            'models_used', 'avg_response_time', 'success_rate',
            'created_at', 'updated_at'
        ]


class MonthlyUsageSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyUsageSummary
        fields = [
            'year', 'month', 'total_requests', 'total_tokens', 'total_cost',
            'daily_breakdown', 'models_used', 'avg_response_time', 'success_rate',
            'created_at', 'updated_at'
        ]


class UsageAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageAlert
        fields = [
            'id', 'alert_type', 'severity', 'title', 'message',
            'threshold_value', 'current_value', 'is_read', 'is_active',
            'created_at'
        ]


class UsageStatsSerializer(serializers.Serializer):
    """Comprehensive usage statistics"""
    daily = DailyUsageSummarySerializer()
    monthly = MonthlyUsageSummarySerializer()
    recent_records = UsageRecordSerializer(many=True)
    alerts = UsageAlertSerializer(many=True)
    quotas = serializers.DictField()


class UsageDashboardSerializer(serializers.Serializer):
    """Dashboard overview of usage statistics"""
    today = serializers.DictField()
    this_month = serializers.DictField()
    limits = serializers.DictField()
    recent_activity = UsageRecordSerializer(many=True)
    active_alerts = UsageAlertSerializer(many=True)
    usage_trend = serializers.ListField()
    top_models = serializers.ListField()