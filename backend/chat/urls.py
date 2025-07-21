from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('conversations/', views.ConversationListCreateView.as_view(), name='conversation-list-create'),
    path('conversations/<uuid:pk>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<uuid:conversation_id>/messages/', views.conversation_messages, name='conversation-messages'),
    path('conversations/<uuid:conversation_id>/delete/', views.delete_conversation, name='delete-conversation'),
    path('chat/', views.ChatView.as_view(), name='chat'),
    path('messages/<uuid:message_id>/regenerate/', views.regenerate_response, name='regenerate-response'),
]