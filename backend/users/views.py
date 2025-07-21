from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, UserAPIKey
from .serializers import (
    UserSerializer, UserAPIKeySerializer, UserRegistrationSerializer, 
    UserLoginSerializer
)
from chat.openrouter_service import openrouter_service


class UserRegistrationView(generics.CreateAPIView):
    """Register a new user"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Return user data without password
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get or update user profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserAPIKeyListCreateView(generics.ListCreateAPIView):
    """List user API keys or create a new one"""
    serializer_class = UserAPIKeySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAPIKey.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Verify the API key before saving
        api_key = serializer.validated_data['api_key']
        is_valid, message = openrouter_service.verify_api_key(api_key)
        
        if not is_valid:
            raise serializers.ValidationError({'api_key': f'Invalid API key: {message}'})
        
        serializer.save(user=self.request.user)


class UserAPIKeyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete a specific API key"""
    serializer_class = UserAPIKeySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAPIKey.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """Authenticate user and return user data"""
    serializer = UserLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    
    user = authenticate(username=username, password=password)
    if user:
        user_serializer = UserSerializer(user)
        return Response({
            'message': 'Login successful',
            'user': user_serializer.data
        })
    else:
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """Logout user (client should clear tokens)"""
    return Response({'message': 'Logout successful'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_api_key(request):
    """Verify an OpenRouter API key"""
    api_key = request.data.get('api_key')
    if not api_key:
        return Response(
            {'error': 'API key is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    is_valid, message = openrouter_service.verify_api_key(api_key)
    
    return Response({
        'valid': is_valid,
        'message': message
    })


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_limits(request):
    """Update user's usage limits"""
    user = request.user
    data = request.data
    
    if 'daily_request_limit' in data:
        user.daily_request_limit = data['daily_request_limit']
    
    if 'monthly_request_limit' in data:
        user.monthly_request_limit = data['monthly_request_limit']
    
    if 'daily_cost_limit' in data:
        user.daily_cost_limit = data['daily_cost_limit']
    
    if 'monthly_cost_limit' in data:
        user.monthly_cost_limit = data['monthly_cost_limit']
    
    if 'preferred_model' in data:
        user.preferred_model = data['preferred_model']
    
    if 'theme_preference' in data:
        user.theme_preference = data['theme_preference']
    
    user.save()
    
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics and overview"""
    user = request.user
    
    # Get usage statistics
    daily_usage = user.get_daily_usage()
    monthly_usage = user.get_monthly_usage()
    can_request, message = user.can_make_request()
    
    # Get conversation count
    from chat.models import Conversation
    conversation_count = Conversation.objects.filter(user=user, is_active=True).count()
    
    # Get total API keys
    api_key_count = UserAPIKey.objects.filter(user=user, is_active=True).count()
    
    stats = {
        'daily_usage': daily_usage,
        'monthly_usage': monthly_usage,
        'can_make_request': {'allowed': can_request, 'message': message},
        'conversation_count': conversation_count,
        'api_key_count': api_key_count,
        'limits': {
            'daily_requests': user.daily_request_limit,
            'monthly_requests': user.monthly_request_limit,
            'daily_cost': float(user.daily_cost_limit),
            'monthly_cost': float(user.monthly_cost_limit)
        }
    }
    
    return Response(stats)
