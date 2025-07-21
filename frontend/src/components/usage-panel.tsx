"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { UsageDashboard, UsageAlert } from '@/lib/api';

interface UsagePanelProps {
  dashboard: UsageDashboard | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function UsagePanel({ dashboard, isLoading, error, onRefresh }: UsagePanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('daily');

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Usage Data</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <div className="border rounded-lg p-6 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Usage Data</h3>
          <p className="text-sm text-gray-600">Start chatting to see your usage statistics</p>
        </div>
      </div>
    );
  }

  const currentData = selectedPeriod === 'daily' ? dashboard.today : dashboard.this_month;
  const currentLimits = selectedPeriod === 'daily' 
    ? { requests: dashboard.limits.daily_requests, cost: dashboard.limits.daily_cost }
    : { requests: dashboard.limits.monthly_requests, cost: dashboard.limits.monthly_cost };

  const requestsPercentage = currentLimits.requests > 0 
    ? (currentData.requests / currentLimits.requests) * 100 
    : 0;
  const costPercentage = currentLimits.cost > 0 
    ? (currentData.cost / currentLimits.cost) * 100 
    : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Usage Tracking</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('daily')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'daily'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Active Alerts */}
      {dashboard.active_alerts.length > 0 && (
        <div className="border border-yellow-200 rounded-lg">
          <div className="p-4 border-b border-yellow-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Active Alerts</span>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {dashboard.active_alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-xs mt-1">{alert.message}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-white bg-opacity-50">
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Usage Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Requests</p>
              <p className="text-lg font-semibold">{currentData.requests}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cost</p>
              <p className="text-lg font-semibold">${currentData.cost.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quota Progress */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-medium">Quota Usage</h3>
        </div>
        <div className="p-4 space-y-4">
          {/* Requests Quota */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Requests</span>
              <span className="text-xs text-gray-600">
                {currentData.requests} / {currentLimits.requests}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getProgressColor(requestsPercentage)}`}
                style={{ width: `${Math.min(requestsPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(100 - requestsPercentage).toFixed(1)}% remaining
            </p>
          </div>

          {/* Cost Quota */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Cost</span>
              <span className="text-xs text-gray-600">
                ${currentData.cost.toFixed(4)} / ${currentLimits.cost.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getProgressColor(costPercentage)}`}
                style={{ width: `${Math.min(costPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(100 - costPercentage).toFixed(1)}% remaining
            </p>
          </div>
        </div>
      </div>

      {/* Usage Trend */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-medium">7-Day Trend</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {dashboard.usage_trend.map((day, index) => {
              const prevDay = index > 0 ? dashboard.usage_trend[index - 1] : null;
              const trend = prevDay ? day.requests - prevDay.requests : 0;
              const isUp = trend > 0;
              const isDown = trend < 0;

              return (
                <div key={day.date} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-16">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    {isUp && <TrendingUp className="w-3 h-3 text-green-500" />}
                    {isDown && <TrendingDown className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{day.requests} requests</p>
                    <p className="text-xs text-gray-500">${day.cost.toFixed(4)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Models */}
      {dashboard.top_models.length > 0 && (
        <div className="border rounded-lg">
          <div className="p-4 border-b">
            <h3 className="font-medium">Top Models (This Month)</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {dashboard.top_models.map((model, index) => (
                <div key={model.model__model_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{model.model__display_name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{model.requests}</p>
                    <p className="text-xs text-gray-500">${model.cost.toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {dashboard.recent_activity.length > 0 && (
        <div className="border rounded-lg">
          <div className="p-4 border-b">
            <h3 className="font-medium">Recent Activity</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {dashboard.recent_activity.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${record.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{record.model.display_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{record.tokens_used} tokens</p>
                    <p className="text-xs text-gray-500">${record.cost.toFixed(6)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}