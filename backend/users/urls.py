from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.login, name='user-login'),
    path('logout/', views.logout, name='user-logout'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('api-keys/', views.UserAPIKeyListCreateView.as_view(), name='api-key-list-create'),
    path('api-keys/<int:pk>/', views.UserAPIKeyDetailView.as_view(), name='api-key-detail'),
    path('verify-api-key/', views.verify_api_key, name='verify-api-key'),
    path('update-limits/', views.update_limits, name='update-limits'),
    path('stats/', views.user_stats, name='user-stats'),
]