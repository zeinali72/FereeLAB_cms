from rest_framework import serializers
from .models import User, UserAPIKey


class UserSerializer(serializers.ModelSerializer):
    daily_usage = serializers.SerializerMethodField()
    monthly_usage = serializers.SerializerMethodField()
    can_make_request = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'daily_request_limit', 'monthly_request_limit', 
            'daily_cost_limit', 'monthly_cost_limit',
            'preferred_model', 'theme_preference',
            'daily_usage', 'monthly_usage', 'can_make_request',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_daily_usage(self, obj):
        return obj.get_daily_usage()
    
    def get_monthly_usage(self, obj):
        return obj.get_monthly_usage()
    
    def get_can_make_request(self, obj):
        can_request, message = obj.can_make_request()
        return {'allowed': can_request, 'message': message}


class UserAPIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAPIKey
        fields = ['id', 'name', 'api_key', 'is_active', 'last_used', 'created_at']
        read_only_fields = ['id', 'last_used', 'created_at']
        extra_kwargs = {
            'api_key': {'write_only': True}
        }


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)