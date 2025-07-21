from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import UsageRecord, DailyUsageSummary, MonthlyUsageSummary, UsageAlert
from .serializers import (
    UsageRecordSerializer, DailyUsageSummarySerializer, 
    MonthlyUsageSummarySerializer, UsageAlertSerializer,
    UsageDashboardSerializer
)


class UsageRecordListView(generics.ListAPIView):
    """List user's usage records"""
    serializer_class = UsageRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = UsageRecord.objects.filter(user=self.request.user)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        # Filter by model
        model_id = self.request.query_params.get('model')
        if model_id:
            queryset = queryset.filter(model__model_id=model_id)
        
        # Filter by success status
        success = self.request.query_params.get('success')
        if success is not None:
            queryset = queryset.filter(success=success.lower() == 'true')
        
        return queryset


class DailyUsageSummaryListView(generics.ListAPIView):
    """List user's daily usage summaries"""
    serializer_class = DailyUsageSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = DailyUsageSummary.objects.filter(user=self.request.user)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset


class MonthlyUsageSummaryListView(generics.ListAPIView):
    """List user's monthly usage summaries"""
    serializer_class = MonthlyUsageSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MonthlyUsageSummary.objects.filter(user=self.request.user)


class UsageAlertListView(generics.ListAPIView):
    """List user's usage alerts"""
    serializer_class = UsageAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = UsageAlert.objects.filter(user=self.request.user)
        
        # Filter by active status
        active_only = self.request.query_params.get('active_only')
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        
        # Filter by read status
        unread_only = self.request.query_params.get('unread_only')
        if unread_only and unread_only.lower() == 'true':
            queryset = queryset.filter(is_read=False)
        
        return queryset


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def usage_dashboard(request):
    """Get comprehensive usage dashboard data"""
    user = request.user
    today = timezone.now().date()
    month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0).date()
    week_start = today - timedelta(days=today.weekday())
    
    # Today's usage
    today_usage = user.get_daily_usage()
    
    # This month's usage
    monthly_usage = user.get_monthly_usage()
    
    # User limits
    limits = {
        'daily_requests': user.daily_request_limit,
        'monthly_requests': user.monthly_request_limit,
        'daily_cost': float(user.daily_cost_limit),
        'monthly_cost': float(user.monthly_cost_limit)
    }
    
    # Recent activity (last 10 records)
    recent_activity = UsageRecord.objects.filter(user=user)[:10]
    
    # Active alerts
    active_alerts = UsageAlert.objects.filter(user=user, is_active=True, is_read=False)
    
    # Usage trend (last 7 days)
    usage_trend = []
    for i in range(7):
        date = today - timedelta(days=i)
        day_records = UsageRecord.objects.filter(
            user=user,
            created_at__date=date
        ).aggregate(
            requests=Count('id'),
            cost=Sum('cost'),
            tokens=Sum('tokens_used')
        )
        
        usage_trend.append({
            'date': date.isoformat(),
            'requests': day_records['requests'] or 0,
            'cost': float(day_records['cost'] or 0),
            'tokens': day_records['tokens'] or 0
        })
    
    usage_trend.reverse()  # Chronological order
    
    # Top models (this month)
    top_models = UsageRecord.objects.filter(
        user=user,
        created_at__date__gte=month_start
    ).values(
        'model__display_name',
        'model__model_id'
    ).annotate(
        requests=Count('id'),
        cost=Sum('cost'),
        tokens=Sum('tokens_used')
    ).order_by('-requests')[:5]
    
    dashboard_data = {
        'today': today_usage,
        'this_month': monthly_usage,
        'limits': limits,
        'recent_activity': UsageRecordSerializer(recent_activity, many=True).data,
        'active_alerts': UsageAlertSerializer(active_alerts, many=True).data,
        'usage_trend': usage_trend,
        'top_models': list(top_models)
    }
    
    return Response(dashboard_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def usage_statistics(request):
    """Get detailed usage statistics"""
    user = request.user
    
    # Time periods
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0).date()
    year_start = timezone.now().replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0).date()
    
    def get_period_stats(start_date, end_date=None):
        queryset = UsageRecord.objects.filter(user=user, created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        return queryset.aggregate(
            total_requests=Count('id'),
            total_cost=Sum('cost'),
            total_tokens=Sum('tokens_used'),
            avg_response_time=Avg('response_time'),
            successful_requests=Count('id', filter=Q(success=True))
        )
    
    # Calculate statistics for different periods
    stats = {
        'today': get_period_stats(today),
        'this_week': get_period_stats(week_start),
        'this_month': get_period_stats(month_start),
        'this_year': get_period_stats(year_start),
    }
    
    # Calculate success rates
    for period in stats:
        total = stats[period]['total_requests'] or 0
        successful = stats[period]['successful_requests'] or 0
        stats[period]['success_rate'] = (successful / total * 100) if total > 0 else 100.0
        
        # Convert Decimal values to float
        stats[period]['total_cost'] = float(stats[period]['total_cost'] or 0)
        stats[period]['avg_response_time'] = float(stats[period]['avg_response_time'] or 0)
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_alert_read(request, alert_id):
    """Mark a usage alert as read"""
    try:
        alert = UsageAlert.objects.get(id=alert_id, user=request.user)
        alert.is_read = True
        alert.save()
        return Response({'message': 'Alert marked as read'})
    except UsageAlert.DoesNotExist:
        return Response({'error': 'Alert not found'}, status=404)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def usage_quotas(request):
    """Get current usage vs quotas"""
    user = request.user
    daily_usage = user.get_daily_usage()
    monthly_usage = user.get_monthly_usage()
    
    quotas = {
        'daily': {
            'requests': {
                'used': daily_usage['requests'],
                'limit': user.daily_request_limit,
                'percentage': (daily_usage['requests'] / user.daily_request_limit * 100) if user.daily_request_limit > 0 else 0
            },
            'cost': {
                'used': daily_usage['cost'],
                'limit': float(user.daily_cost_limit),
                'percentage': (daily_usage['cost'] / float(user.daily_cost_limit) * 100) if user.daily_cost_limit > 0 else 0
            }
        },
        'monthly': {
            'requests': {
                'used': monthly_usage['requests'],
                'limit': user.monthly_request_limit,
                'percentage': (monthly_usage['requests'] / user.monthly_request_limit * 100) if user.monthly_request_limit > 0 else 0
            },
            'cost': {
                'used': monthly_usage['cost'],
                'limit': float(user.monthly_cost_limit),
                'percentage': (monthly_usage['cost'] / float(user.monthly_cost_limit) * 100) if user.monthly_cost_limit > 0 else 0
            }
        }
    }
    
    return Response(quotas)
