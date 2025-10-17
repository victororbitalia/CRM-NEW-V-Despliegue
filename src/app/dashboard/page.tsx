'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import apiClient from '@/lib/api';

// Analytics components
import { 
  MetricCard, 
  OccupancyChart, 
  ReservationChart, 
  CustomerAnalytics,
  FinancialReport,
  TrendAnalysis,
  OccupancyCalendar
} from '@/components/analytics';

// Icons - Simple SVG components to avoid external dependencies
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TableIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Types
interface DashboardData {
  summary: {
    totalReservations: number;
    confirmedReservations: number;
    completedReservations: number;
    cancelledReservations: number;
    noShowReservations: number;
    totalCustomers: number;
    activeTables: number;
    totalRevenue: number;
    occupancyRate: number;
    confirmationRate: number;
    completionRate: number;
    cancellationRate: number;
    noShowRate: number;
  };
  charts: {
    dailyReservations: Array<{
      day: string;
      count: number;
      confirmed: number;
      completed: number;
      cancelled: number;
      noShow: number;
    }>;
    hourlyReservations: Array<{
      hour: string;
      count: number;
    }>;
    areaPerformance: Array<{
      id: string;
      name: string;
      reservationCount: number;
      avgPartySize: number;
      completedCount: number;
      cancelledCount: number;
    }>;
    topCustomers: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      reservationCount: number;
      totalGuests: number;
      lastVisit: string;
    }>;
  };
  period: {
    start: Date;
    end: Date;
    type: string;
  };
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'customers' | 'financial' | 'trends'>('overview');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range based on selection
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }
      
      const response = await apiClient.get<any>(
        `/api/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&period=${dateRange}`
      );
      
      setDashboardData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh dashboard data
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Export dashboard data
  const handleExport = async () => {
    try {
      const response = await fetch('/api/analytics/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dateRange]);

  if (loading && !dashboardData) {
    return (
      <ProtectedRoute>
        <Layout title="Dashboard" subtitle="Panel de Control">
          <div className="flex justify-center items-center h-64">
            <Loading size="lg" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout title="Dashboard" subtitle="Panel de Control">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Button variant="outline" onClick={fetchDashboardData}>
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout title="Dashboard" subtitle="Panel de Control">
        <div className="animate-fade-in">
          {/* Header with controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                {dashboardData?.period && (
                  <>
                    {new Date(dashboardData.period.start).toLocaleDateString()} - {new Date(dashboardData.period.end).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {/* Date range selector */}
              <div className="flex rounded-md shadow-sm">
                {(['today', 'week', 'month', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md rounded-r-md border ${
                      dateRange === range
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } ${range === 'today' ? 'rounded-l-md' : ''} ${range === 'year' ? 'rounded-r-md' : ''}`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Action buttons */}
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center"
              >
                <RefreshIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExport}
                className="inline-flex items-center"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: ChartBarIcon },
                { key: 'reservations', label: 'Reservations', icon: CalendarIcon },
                { key: 'customers', label: 'Customers', icon: UsersIcon },
                { key: 'financial', label: 'Financial', icon: CurrencyDollarIcon },
                { key: 'trends', label: 'Trends', icon: TrendingUpIcon },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && dashboardData && dashboardData.summary && (
              <>
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Reservations"
                    value={dashboardData.summary.totalReservations}
                    change={dashboardData.summary.confirmationRate}
                    changeLabel="Confirmation Rate"
                    icon={<CalendarIcon className="h-6 w-6" />}
                    trend={
                      dashboardData.summary.confirmationRate > 80 ? 'up' :
                      dashboardData.summary.confirmationRate > 60 ? 'neutral' : 'down'
                    }
                    loading={refreshing}
                  />
                  
                  <MetricCard
                    title="Active Tables"
                    value={dashboardData.summary.activeTables}
                    change={dashboardData.summary.occupancyRate}
                    changeLabel="Occupancy Rate"
                    icon={<TableIcon className="h-6 w-6" />}
                    trend={
                      dashboardData.summary.occupancyRate > 75 ? 'up' :
                      dashboardData.summary.occupancyRate > 50 ? 'neutral' : 'down'
                    }
                    loading={refreshing}
                  />
                  
                  <MetricCard
                    title="Total Customers"
                    value={dashboardData.summary.totalCustomers}
                    change={dashboardData.summary.completionRate}
                    changeLabel="Completion Rate"
                    icon={<UsersIcon className="h-6 w-6" />}
                    trend={
                      dashboardData.summary.completionRate > 80 ? 'up' :
                      dashboardData.summary.completionRate > 60 ? 'neutral' : 'down'
                    }
                    loading={refreshing}
                  />
                  
                  <MetricCard
                    title="Total Revenue"
                    value={`$${dashboardData.summary.totalRevenue.toFixed(0)}`}
                    change={dashboardData.summary.cancellationRate}
                    changeLabel="Cancellation Rate"
                    icon={<CurrencyDollarIcon className="h-6 w-6" />}
                    trend={
                      dashboardData.summary.cancellationRate < 10 ? 'up' :
                      dashboardData.summary.cancellationRate < 20 ? 'neutral' : 'down'
                    }
                    variant="success"
                    loading={refreshing}
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OccupancyChart
                    data={dashboardData.charts.dailyReservations.map(day => ({
                      period: day.day,
                      occupancyRate: (day.completed / day.count) * 100,
                      totalTables: 20, // This would come from the API
                      occupiedTables: Math.round((day.completed / day.count) * 20),
                    }))}
                    title="Occupancy Rate"
                    type="line"
                    loading={refreshing}
                  />
                  
                  <ReservationChart
                    data={dashboardData.charts.dailyReservations.map(day => ({
                      period: day.day,
                      total: day.count,
                      confirmed: day.confirmed,
                      completed: day.completed,
                      cancelled: day.cancelled,
                      noShow: day.noShow,
                    }))}
                    title="Reservation Trends"
                    type="line"
                    loading={refreshing}
                  />
                </div>

                {/* Additional Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OccupancyCalendar
                    data={dashboardData.charts.dailyReservations.map(day => ({
                      date: day.day,
                      totalTables: 20, // This would come from the API
                      occupiedTables: Math.round((day.completed / day.count) * 20),
                      occupancyRate: (day.completed / day.count) * 100,
                      totalReservations: day.count,
                      completedReservations: day.completed,
                      cancelledReservations: day.cancelled,
                      revenue: 0, // This would come from the API
                    }))}
                    loading={refreshing}
                  />
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h3>
                    <div className="space-y-4">
                      {dashboardData.charts.topCustomers.slice(0, 5).map((customer, index) => (
                        <div key={customer.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{customer.reservationCount} reservations</p>
                            <p className="text-sm text-gray-500">{customer.totalGuests} guests</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>
            )}

            {activeTab === 'reservations' && dashboardData && dashboardData.charts && (
              <div className="space-y-6">
                <ReservationChart
                  data={dashboardData.charts.dailyReservations.map(day => ({
                    period: day.day,
                    total: day.count,
                    confirmed: day.confirmed,
                    completed: day.completed,
                    cancelled: day.cancelled,
                    noShow: day.noShow,
                  }))}
                  title="Reservation Analysis"
                  type="bar"
                  height={400}
                  loading={refreshing}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OccupancyChart
                    data={dashboardData.charts.dailyReservations.map(day => ({
                      period: day.day,
                      occupancyRate: (day.completed / day.count) * 100,
                      totalTables: 20, // This would come from the API
                      occupiedTables: Math.round((day.completed / day.count) * 20),
                    }))}
                    title="Reservation Occupancy"
                    type="area"
                    loading={refreshing}
                  />
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Hourly Distribution</h3>
                    <div className="h-64">
                      {/* Simple hourly chart visualization */}
                      <div className="h-full flex items-end justify-between space-x-2">
                        {dashboardData.charts.hourlyReservations.map((hour, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-blue-500 rounded-t"
                              style={{
                                height: `${(hour.count / Math.max(...dashboardData.charts.hourlyReservations.map(h => h.count), 1)) * 100}%`
                              }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-1 text-center">
                              {hour.hour}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <CustomerAnalytics
                topCustomers={dashboardData?.charts.topCustomers.map(customer => ({
                  ...customer,
                  isVip: false,
                  totalReservations: customer.reservationCount,
                  avgPartySize: customer.totalGuests / customer.reservationCount,
                  completedReservations: customer.reservationCount, // Assuming all are completed for now
                })) || []}
                segmentation={{}} // This would come from the API
                behavior={[]} // This would come from the API
                retention={{}} // This would come from the API
                preferences={[]} // This would come from the API
                churn={[]} // This would come from the API
                loading={refreshing}
              />
            )}

            {activeTab === 'financial' && (
              <FinancialReport
                summary={{
                  totalReservations: dashboardData?.summary.totalReservations || 0,
                  completedReservations: dashboardData?.summary.completedReservations || 0,
                  cancelledReservations: dashboardData?.summary.cancelledReservations || 0,
                  noShowReservations: dashboardData?.summary.noShowReservations || 0,
                  totalRevenue: dashboardData?.summary.totalRevenue || 0,
                  totalPotentialRevenue: 0, // This would come from the API
                  avgRevenuePerCompletedReservation: 0, // This would come from the API
                  avgRevenuePerGuest: 0, // This would come from the API
                  completionRate: dashboardData?.summary.completionRate || 0,
                  cancellationRate: dashboardData?.summary.cancellationRate || 0,
                  noShowRate: dashboardData?.summary.noShowRate || 0,
                }}
                trends={dashboardData?.charts.dailyReservations.map(day => ({
                  period: day.day,
                  revenue: 0, // This would come from the API
                  totalReservations: day.count,
                  completedReservations: day.completed,
                  cancelledReservations: day.cancelled,
                  noShowReservations: day.noShow,
                })) || []}
                paymentStatus={[]} // This would come from the API
                revenueByArea={dashboardData?.charts.areaPerformance.map(area => ({
                  id: area.id,
                  name: area.name,
                  revenue: 0, // This would come from the API
                  totalReservations: area.reservationCount,
                  completedReservations: area.completedCount,
                  avgDepositAmount: 0, // This would come from the API
                  totalGuests: area.avgPartySize * area.reservationCount,
                  avgPartySize: area.avgPartySize,
                })) || []}
                revenueByPartySize={[]} // This would come from the API
                revenueByTimeSlot={[]} // This would come from the API
                revenueByDayOfWeek={[]} // This would come from the API
                depositAnalysis={{}} // This would come from the API
                cancellationImpact={[]} // This would come from the API
                noShowImpact={{}} // This would come from the API
                loading={refreshing}
              />
            )}

            {activeTab === 'trends' && (
              <TrendAnalysis
                historicalData={dashboardData?.charts.dailyReservations.map(day => ({
                  date: day.day,
                  totalReservations: day.count,
                  completedReservations: day.completed,
                  cancelledReservations: day.cancelled,
                  noShowReservations: day.noShow,
                  revenue: 0, // This would come from the API
                  totalGuests: 0, // This would come from the API
                  occupiedTables: Math.round((day.completed / day.count) * 20),
                })) || []}
                patterns={{
                  dayOfWeek: [], // This would come from the API
                  monthly: [], // This would come from the API
                  seasonal: [], // This would come from the API
                }}
                predictions={{
                  movingAverage: [], // This would come from the API
                  forecast: [], // This would come from the API
                }}
                growthRates={[]} // This would come from the API
                peakDemandPeriods={[]} // This would come from the API
                trendAnalysis={{
                  dataPoints: dashboardData?.charts.dailyReservations.length || 0,
                  minReservations: Math.min(...dashboardData?.charts.dailyReservations.map(d => d.count) || [0]),
                  maxReservations: Math.max(...dashboardData?.charts.dailyReservations.map(d => d.count) || [0]),
                  avgReservations: (dashboardData?.charts.dailyReservations.reduce((sum, d) => sum + d.count, 0) || 0) / (dashboardData?.charts.dailyReservations.length || 1),
                  minRevenue: 0, // This would come from the API
                  maxRevenue: 0, // This would come from the API
                  avgRevenue: 0, // This would come from the API
                  reservationTrend: 'stable', // This would come from the API
                  revenueTrend: 'stable', // This would come from the API
                }}
                loading={refreshing}
              />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}