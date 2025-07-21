from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import ModelProvider, AIModel, ModelUsageStats
from .serializers import (
    ModelProviderSerializer, AIModelSerializer, AIModelListSerializer, 
    ModelUsageStatsSerializer
)


class ModelProviderListView(generics.ListAPIView):
    """List all model providers"""
    queryset = ModelProvider.objects.filter(is_active=True)
    serializer_class = ModelProviderSerializer
    permission_classes = [permissions.AllowAny]


class AIModelListView(generics.ListAPIView):
    """List all available AI models with filtering"""
    serializer_class = AIModelListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = AIModel.objects.filter(is_active=True)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by provider
        provider = self.request.query_params.get('provider')
        if provider:
            queryset = queryset.filter(provider__name=provider)
        
        # Filter by features
        supports_functions = self.request.query_params.get('supports_functions')
        if supports_functions:
            queryset = queryset.filter(supports_functions=True)
        
        supports_vision = self.request.query_params.get('supports_vision')
        if supports_vision:
            queryset = queryset.filter(supports_vision=True)
        
        # Filter featured models
        featured = self.request.query_params.get('featured')
        if featured:
            queryset = queryset.filter(is_featured=True)
        
        # Search by name or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(display_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset


class AIModelDetailView(generics.RetrieveAPIView):
    """Get detailed information about a specific model"""
    queryset = AIModel.objects.filter(is_active=True)
    serializer_class = AIModelSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'model_id'


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def model_categories(request):
    """Get list of available model categories"""
    categories = AIModel.objects.filter(is_active=True).values_list('category', flat=True).distinct()
    return Response({'categories': list(categories)})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_models(request):
    """Get featured models for the homepage/marketplace"""
    models = AIModel.objects.filter(is_active=True, is_featured=True)[:6]
    serializer = AIModelListSerializer(models, many=True)
    return Response({'featured_models': serializer.data})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def model_stats(request):
    """Get overall marketplace statistics"""
    stats = {
        'total_models': AIModel.objects.filter(is_active=True).count(),
        'total_providers': ModelProvider.objects.filter(is_active=True).count(),
        'categories': list(AIModel.objects.filter(is_active=True).values_list('category', flat=True).distinct()),
        'featured_count': AIModel.objects.filter(is_active=True, is_featured=True).count()
    }
    return Response(stats)
