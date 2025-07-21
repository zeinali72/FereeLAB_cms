from rest_framework import serializers
from .models import ModelProvider, AIModel, ModelUsageStats


class ModelProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelProvider
        fields = ['id', 'name', 'display_name', 'description', 'website', 'logo_url', 'is_active']


class AIModelSerializer(serializers.ModelSerializer):
    provider = ModelProviderSerializer(read_only=True)
    estimated_cost = serializers.SerializerMethodField()
    usage_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = AIModel
        fields = [
            'id', 'model_id', 'name', 'display_name', 'provider',
            'description', 'category', 'context_length', 'max_output_tokens',
            'prompt_cost', 'completion_cost', 'quality_score', 'speed_score', 
            'popularity_score', 'supports_functions', 'supports_vision', 
            'supports_streaming', 'is_active', 'is_featured',
            'estimated_cost', 'usage_stats', 'created_at', 'updated_at'
        ]
    
    def get_estimated_cost(self, obj):
        # Return cost for 1000 input tokens and 500 output tokens as example
        return obj.get_estimated_cost(1000, 500)
    
    def get_usage_stats(self, obj):
        try:
            stats = obj.usage_stats
            return {
                'total_requests': stats.total_requests,
                'total_tokens': stats.total_tokens,
                'total_cost': float(stats.total_cost),
                'avg_response_time': float(stats.avg_response_time),
                'success_rate': float(stats.success_rate),
                'last_used': stats.last_used
            }
        except ModelUsageStats.DoesNotExist:
            return {
                'total_requests': 0,
                'total_tokens': 0,
                'total_cost': 0.0,
                'avg_response_time': 0.0,
                'success_rate': 100.0,
                'last_used': None
            }


class AIModelListSerializer(serializers.ModelSerializer):
    """Simplified serializer for model listing"""
    provider_name = serializers.CharField(source='provider.display_name', read_only=True)
    
    class Meta:
        model = AIModel
        fields = [
            'id', 'model_id', 'display_name', 'provider_name',
            'category', 'context_length', 'prompt_cost', 'completion_cost',
            'quality_score', 'speed_score', 'popularity_score',
            'is_featured', 'supports_functions', 'supports_vision'
        ]


class ModelUsageStatsSerializer(serializers.ModelSerializer):
    model_name = serializers.CharField(source='model.display_name', read_only=True)
    
    class Meta:
        model = ModelUsageStats
        fields = [
            'model_name', 'total_requests', 'total_tokens', 'total_cost',
            'avg_response_time', 'success_rate', 'last_used', 'updated_at'
        ]