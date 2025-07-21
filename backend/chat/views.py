from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from decimal import Decimal
import uuid
import time

from .models import Conversation, Message, ChatSession
from marketplace.models import AIModel
from usage.models import UsageRecord
from .serializers import (
    ConversationSerializer, ConversationListSerializer, 
    CreateConversationSerializer, MessageSerializer,
    ChatMessageSerializer, ChatResponseSerializer
)
from .openrouter_service import openrouter_service


class ConversationListCreateView(generics.ListCreateAPIView):
    """List user conversations or create a new one"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Conversation.objects.filter(user=self.request.user, is_active=True)
        return Conversation.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateConversationSerializer
        return ConversationListSerializer


class ConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete a specific conversation"""
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)


class ChatView(APIView):
    """Handle chat messages and responses"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        user_message = data['message']
        conversation_id = data.get('conversation_id')
        model_id = data.get('model_id')
        temperature = data.get('temperature', 0.7)
        max_tokens = data.get('max_tokens', 2048)
        system_prompt = data.get('system_prompt', '')
        
        try:
            # Get or create conversation
            if conversation_id:
                conversation = get_object_or_404(
                    Conversation, 
                    id=conversation_id,
                    user=request.user if request.user.is_authenticated else None
                )
            else:
                # Create new conversation
                if not model_id:
                    return Response(
                        {'error': 'model_id is required for new conversations'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                model = get_object_or_404(AIModel, model_id=model_id)
                conversation = Conversation.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    model=model,
                    system_prompt=system_prompt,
                    temperature=temperature,
                    max_tokens=max_tokens
                )
            
            # Check if user can make request (for authenticated users)
            if request.user.is_authenticated:
                can_request, message = request.user.can_make_request()
                if not can_request:
                    return Response(
                        {'error': message}, 
                        status=status.HTTP_429_TOO_MANY_REQUESTS
                    )
            
            # Create user message
            user_msg = Message.objects.create(
                conversation=conversation,
                role='user',
                content=user_message,
                status='completed'
            )
            
            # Prepare messages for OpenRouter
            messages = []
            if conversation.system_prompt:
                messages.append({
                    'role': 'system',
                    'content': conversation.system_prompt
                })
            
            # Get conversation history
            for msg in conversation.messages.order_by('created_at'):
                messages.append({
                    'role': msg.role,
                    'content': msg.content
                })
            
            # Create assistant message (initially pending)
            assistant_msg = Message.objects.create(
                conversation=conversation,
                role='assistant',
                content='',
                status='processing'
            )
            
            # Call OpenRouter API
            response_data, error = openrouter_service.chat_completion(
                model_id=conversation.model.model_id,
                messages=messages,
                temperature=float(conversation.temperature),
                max_tokens=conversation.max_tokens
            )
            
            if error:
                assistant_msg.status = 'failed'
                assistant_msg.error_message = error
                assistant_msg.save()
                
                return Response({
                    'success': False,
                    'error': error,
                    'conversation': ConversationListSerializer(conversation).data
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Process successful response
            choice = response_data['choices'][0]
            assistant_content = choice['message']['content']
            usage = response_data.get('usage', {})
            
            # Update assistant message
            assistant_msg.content = assistant_content
            assistant_msg.status = 'completed'
            assistant_msg.tokens_used = usage.get('total_tokens', 0)
            assistant_msg.response_time = Decimal(str(response_data.get('response_time', 0)))
            assistant_msg.openrouter_id = response_data.get('id', '')
            assistant_msg.model_used = response_data.get('model', conversation.model.model_id)
            
            # Calculate cost
            prompt_tokens = usage.get('prompt_tokens', 0)
            completion_tokens = usage.get('completion_tokens', 0)
            cost = openrouter_service.calculate_cost(
                conversation.model.model_id, prompt_tokens, completion_tokens
            )
            assistant_msg.cost = cost
            assistant_msg.save()
            
            # Update user message token count (estimate)
            user_msg.tokens_used = prompt_tokens
            user_msg.save()
            
            # Create usage record for authenticated users
            if request.user.is_authenticated:
                UsageRecord.objects.create(
                    user=request.user,
                    model=conversation.model,
                    request_type='chat',
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    tokens_used=usage.get('total_tokens', 0),
                    cost=cost,
                    response_time=assistant_msg.response_time,
                    success=True,
                    openrouter_id=response_data.get('id', ''),
                    actual_model=response_data.get('model', conversation.model.model_id)
                )
            
            # Prepare response
            response_data = {
                'success': True,
                'message': MessageSerializer(assistant_msg).data,
                'conversation': ConversationListSerializer(conversation).data,
                'usage': {
                    'prompt_tokens': prompt_tokens,
                    'completion_tokens': completion_tokens,
                    'total_tokens': usage.get('total_tokens', 0),
                    'cost': float(cost)
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Unexpected error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def conversation_messages(request, conversation_id):
    """Get messages for a specific conversation"""
    conversation = get_object_or_404(
        Conversation, 
        id=conversation_id, 
        user=request.user
    )
    messages = conversation.messages.all()
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_conversation(request, conversation_id):
    """Delete a conversation"""
    conversation = get_object_or_404(
        Conversation, 
        id=conversation_id, 
        user=request.user
    )
    conversation.is_active = False
    conversation.save()
    return Response({'message': 'Conversation deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def regenerate_response(request, message_id):
    """Regenerate an assistant response"""
    message = get_object_or_404(
        Message,
        id=message_id,
        conversation__user=request.user,
        role='assistant'
    )
    
    conversation = message.conversation
    
    # Check if user can make request
    can_request, message_text = request.user.can_make_request()
    if not can_request:
        return Response(
            {'error': message_text}, 
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )
    
    # Get messages up to this point
    messages = []
    if conversation.system_prompt:
        messages.append({
            'role': 'system',
            'content': conversation.system_prompt
        })
    
    for msg in conversation.messages.filter(created_at__lt=message.created_at).order_by('created_at'):
        messages.append({
            'role': msg.role,
            'content': msg.content
        })
    
    # Update message status
    message.status = 'processing'
    message.save()
    
    # Call OpenRouter API
    response_data, error = openrouter_service.chat_completion(
        model_id=conversation.model.model_id,
        messages=messages,
        temperature=float(conversation.temperature),
        max_tokens=conversation.max_tokens
    )
    
    if error:
        message.status = 'failed'
        message.error_message = error
        message.save()
        return Response({'error': error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Update message with new response
    choice = response_data['choices'][0]
    usage = response_data.get('usage', {})
    
    message.content = choice['message']['content']
    message.status = 'completed'
    message.tokens_used = usage.get('total_tokens', 0)
    message.response_time = Decimal(str(response_data.get('response_time', 0)))
    message.openrouter_id = response_data.get('id', '')
    message.model_used = response_data.get('model', conversation.model.model_id)
    
    # Calculate cost
    prompt_tokens = usage.get('prompt_tokens', 0)
    completion_tokens = usage.get('completion_tokens', 0)
    cost = openrouter_service.calculate_cost(
        conversation.model.model_id, prompt_tokens, completion_tokens
    )
    message.cost = cost
    message.save()
    
    # Create usage record
    UsageRecord.objects.create(
        user=request.user,
        model=conversation.model,
        request_type='chat',
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        tokens_used=usage.get('total_tokens', 0),
        cost=cost,
        response_time=message.response_time,
        success=True,
        openrouter_id=response_data.get('id', ''),
        actual_model=response_data.get('model', conversation.model.model_id)
    )
    
    return Response(MessageSerializer(message).data)
