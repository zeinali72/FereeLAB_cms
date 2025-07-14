from django.http import JsonResponse
from .models import ChatMessage
from .services import get_chatbot_response
import json

def chat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = data.get('message')

        # Get the response from our new service
        response_message = get_chatbot_response(message)

        # Save the conversation to the database
        ChatMessage.objects.create(text=message, is_bot=False)
        ChatMessage.objects.create(text=response_message, is_bot=True)

        return JsonResponse({'response': response_message})

    messages = ChatMessage.objects.all().order_by('created_at')
    return render(request, 'chatbot/chat.html', {'messages': messages})