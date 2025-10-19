import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts'
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import { analyticsAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Fetch analytics data
  const { data: performanceData, loading: perfLoading, refetch: refetchPerf } = useFetch(
    () => analyticsAPI.getPerformance({ range: dateRange }),
    [dateRange],
    true
  )

  const { data: predictions, loading: predLoading } = useFetch(
    () => analyticsAPI.getPredictions(),
    [],
    true
  )

  const { data: trends, loading: trendsLoading } = useFetch(
    () => analyticsAPI.getTrends({ range: dateRange }),
    [dateRange],
    true
  )

  // Mock data for demonstration
  const mockPerformanceData = performanceData || [
    { date: 'Mon', energy: 42, efficiency: 18.5, predicted: 45 },
    { date: 'Tue', energy: 45, efficiency: 19.2, predicted: 46 },
    { date: 'Wed', energy: 38, efficiency: 17.8, predicted: 44 },
    { date: 'Thu', energy: 48, efficiency: 20.1, predicted: 47 },
    { date: 'Fri', energy: 51, efficiency: 20.8, predicted: 50 },
    { date: 'Sat', energy: 44, efficiency: 19.5, predicted: 48 },
    { date: 'Sun', energy: 46, efficiency: 19.8, predicted: 49 },
  ]

  const mockTrendData = trends || [
    { month: 'Jan', power: 1250, efficiency: 18.2 },
    { month: 'Feb', power: 1380, efficiency: 18.8 },
    { month: 'Mar', power: 1520, efficiency: 19.4 },
    { month: 'Apr', power: 1680, efficiency: 19.8 },
    { month: 'May', power: 1850, efficiency: 20.2 },
    { month: 'Jun', power: 1920, efficiency: 20.5 },
  ]

  const mockPredictionData = predictions || [
    { time: '00:00', actual: 0, predicted: 0 },
    { time: '06:00', actual: 1.2, predicted: 1.5 },
    { time: '09:00', actual: 3.8, predicted: 4.0 },
    { time: '12:00', actual: 5.2, predicted: 5.5 },
    { time: '15:00', actual: 4.1, predicted: 4.3 },
    { time: '18:00', actual: 1.8, predicted: 2.0 },
    { time: '21:00', actual: 0, predicted: 0 },
  ]

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value)
  }

  const handleExport = () => {
    // Export functionality would be implemented here
    alert('Exporting analytics data...')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Historical performance and predictive insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="input-field py-2"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      {dateRange === 'custom' && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Efficiency</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">19.4%</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+2.3% vs last period</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Energy</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">315 kWh</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5.8% vs last period</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Peak Power</p>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">5.8 kW</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">-1.2% vs last period</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">99.8%</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Excellent</p>
        </div>
      </div>

      {/* Performance Chart */}
      <ChartCard
        title="Energy Production & Efficiency"
        description="Daily energy production with efficiency tracking"
        onRefresh={refetchPerf}
        loading={perfLoading}
      >
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={mockPerformanceData}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="energy" 
              stroke="#FBBF24" 
              fillOpacity={1} 
              fill="url(#colorEnergy)"
              name="Energy (kWh)"
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981' }}
              name="Efficiency (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Prediction vs Actual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="ML Prediction vs Actual"
          description="Machine learning predictions compared to actual performance"
          loading={predLoading}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockPredictionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
                name="Actual (kW)"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#8B5CF6' }}
                name="Predicted (kW)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Monthly Trends"
          description="Power generation and efficiency trends over time"
          loading={trendsLoading}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Bar 
                dataKey="power" 
                fill="#FBBF24" 
                radius={[8, 8, 0, 0]}
                name="Power (kWh)"
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Efficiency (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Insights
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Efficiency Improvement
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  System efficiency has improved by 2.3% over the last 7 days. Optimal panel cleaning schedule is being maintained.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Peak Production Hours
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Peak power generation occurs between 11:00 AM and 2:00 PM. Consider load shifting for optimal energy usage.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Weather Impact
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Cloud cover reduced output by 15% on Wednesday. ML model predicts improved conditions for next week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics