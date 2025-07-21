from rest_framework import serializers
from .models import Conversation, Message, ChatSession
from marketplace.serializers import AIModelListSerializer
from users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            'id', 'role', 'content', 'tokens_used', 'cost', 'response_time',
            'status', 'error_message', 'openrouter_id', 'model_used',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'tokens_used', 'cost', 'response_time', 'created_at', 'updated_at']


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    model = AIModelListSerializer(read_only=True)
    title = serializers.SerializerMethodField()
    message_count = serializers.SerializerMethodField()
    total_tokens = serializers.SerializerMethodField()
    total_cost = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'title', 'model', 'system_prompt', 'temperature', 'max_tokens',
            'is_active', 'messages', 'message_count', 'total_tokens', 'total_cost',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_title(self, obj):
        return obj.get_title()
    
    def get_message_count(self, obj):
        return obj.get_message_count()
    
    def get_total_tokens(self, obj):
        return obj.get_total_tokens()
    
    def get_total_cost(self, obj):
        return float(obj.get_total_cost())


class ConversationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for conversation listing"""
    title = serializers.SerializerMethodField()
    model_name = serializers.CharField(source='model.display_name', read_only=True)
    message_count = serializers.SerializerMethodField()
    last_message_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'title', 'model_name', 'message_count', 'last_message_preview',
            'is_active', 'created_at', 'updated_at'
        ]
    
    def get_title(self, obj):
        return obj.get_title()
    
    def get_message_count(self, obj):
        return obj.get_message_count()
    
    def get_last_message_preview(self, obj):
        last_message = obj.messages.filter(role='user').last()
        if last_message:
            return last_message.content[:100] + ("..." if len(last_message.content) > 100 else "")
        return ""


class CreateConversationSerializer(serializers.ModelSerializer):
    model_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = Conversation
        fields = ['title', 'model_id', 'system_prompt', 'temperature', 'max_tokens']
    
    def create(self, validated_data):
        from marketplace.models import AIModel
        
        model_id = validated_data.pop('model_id')
        model = AIModel.objects.get(model_id=model_id)
        
        conversation = Conversation.objects.create(
            user=self.context['request'].user,
            model=model,
            **validated_data
        )
        return conversation


class ChatMessageSerializer(serializers.Serializer):
    """Serializer for sending chat messages"""
    message = serializers.CharField()
    conversation_id = serializers.UUIDField(required=False)
    model_id = serializers.CharField(required=False)
    temperature = serializers.DecimalField(max_digits=3, decimal_places=2, required=False, default=0.7)
    max_tokens = serializers.IntegerField(required=False, default=2048)
    system_prompt = serializers.CharField(required=False, allow_blank=True)


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for chat response"""
    message = MessageSerializer()
    conversation = ConversationListSerializer()
    usage = serializers.DictField()
    success = serializers.BooleanField()
    error = serializers.CharField(required=False)


class ChatSessionSerializer(serializers.ModelSerializer):
    model = AIModelListSerializer(read_only=True)
    
    class Meta:
        model = ChatSession
        fields = [
            'session_id', 'model', 'conversation_data', 'total_requests',
            'total_tokens', 'total_cost', 'created_at', 'last_activity'
        ]