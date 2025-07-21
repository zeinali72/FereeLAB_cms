from django.urls import path
from . import views

app_name = 'usage'

urlpatterns = [
    path('records/', views.UsageRecordListView.as_view(), name='usage-records'),
    path('daily/', views.DailyUsageSummaryListView.as_view(), name='daily-summaries'),
    path('monthly/', views.MonthlyUsageSummaryListView.as_view(), name='monthly-summaries'),
    path('alerts/', views.UsageAlertListView.as_view(), name='usage-alerts'),
    path('dashboard/', views.usage_dashboard, name='usage-dashboard'),
    path('statistics/', views.usage_statistics, name='usage-statistics'),
    path('quotas/', views.usage_quotas, name='usage-quotas'),
    path('alerts/<int:alert_id>/read/', views.mark_alert_read, name='mark-alert-read'),
]