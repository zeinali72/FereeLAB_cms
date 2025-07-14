from django.shortcuts import render
from django.http import JsonResponse
from .models import ChatMessage
import json

def chat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = data.get('message')
        # Here you would add your chatbot logic
        # For now, we'll just echo the message
        response_message = f"You said: {message}"
        
        ChatMessage.objects.create(text=message, is_bot=False)
        ChatMessage.objects.create(text=response_message, is_bot=True)
        
        return JsonResponse({'response': response_message})
    
    messages = ChatMessage.objects.all().order_by('created_at')
    return render(request, 'chatbot/chat.html', {'messages': messages})