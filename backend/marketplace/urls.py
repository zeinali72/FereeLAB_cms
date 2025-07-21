from django.urls import path
from . import views

app_name = 'marketplace'

urlpatterns = [
    path('providers/', views.ModelProviderListView.as_view(), name='provider-list'),
    path('models/', views.AIModelListView.as_view(), name='model-list'),
    path('models/<str:model_id>/', views.AIModelDetailView.as_view(), name='model-detail'),
    path('categories/', views.model_categories, name='model-categories'),
    path('featured/', views.featured_models, name='featured-models'),
    path('stats/', views.model_stats, name='model-stats'),
]