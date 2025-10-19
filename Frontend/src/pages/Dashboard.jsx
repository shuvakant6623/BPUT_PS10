import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Zap, Gauge, Activity, Thermometer, Sun, TrendingUp } from 'lucide-react'
import SensorCard from '../components/SensorCard'
import ChartCard from '../components/ChartCard'
import { useLiveSensorData } from '../hooks/useWebSocket'
import { sensorAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'

const Dashboard = () => {
  const { sensorData, isConnected, error, reconnect } = useLiveSensorData()
  const [chartData, setChartData] = useState([])
  const maxDataPoints = 20

  // Fetch initial sensor data from API
  const { data: currentSensorData, loading, refetch } = useFetch(
    () => sensorAPI.getCurrent(),
    [],
    true
  )

  // Update chart data when new sensor data arrives
  useEffect(() => {
    if (sensorData.timestamp) {
      setChartData(prevData => {
        const newData = [...prevData, {
          time: new Date().toLocaleTimeString(),
          power: sensorData.power || 0,
          voltage: sensorData.voltage || 0,
          current: sensorData.current || 0,
          temperature: sensorData.temperature || 0,
        }]
        
        // Keep only last maxDataPoints
        if (newData.length > maxDataPoints) {
          return newData.slice(newData.length - maxDataPoints)
        }
        return newData
      })
    }
  }, [sensorData])

  // Use live data if available, otherwise use API data
  const displayData = sensorData.timestamp ? sensorData : currentSensorData || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time solar system monitoring and performance metrics
          </p>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isConnected ? 'Live Data' : 'Disconnected'}
          </span>
          {!isConnected && error && (
            <button
              onClick={reconnect}
              className="ml-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SensorCard
          title="Power Output"
          value={displayData.power?.toFixed(2) || '0.00'}
          unit="kW"
          icon={Zap}
          color="yellow"
          trend={displayData.powerTrend}
          loading={loading && !sensorData.timestamp}
        />
        
        <SensorCard
          title="Voltage"
          value={displayData.voltage?.toFixed(1) || '0.0'}
          unit="V"
          icon={Gauge}
          color="blue"
          trend={displayData.voltageTrend}
          loading={loading && !sensorData.timestamp}
        />
        
        <SensorCard
          title="Current"
          value={displayData.current?.toFixed(2) || '0.00'}
          unit="A"
          icon={Activity}
          color="green"
          trend={displayData.currentTrend}
          loading={loading && !sensorData.timestamp}
        />
        
        <SensorCard
          title="Temperature"
          value={displayData.temperature?.toFixed(1) || '0.0'}
          unit="°C"
          icon={Thermometer}
          color="orange"
          trend={displayData.tempTrend}
          loading={loading && !sensorData.timestamp}
        />
        
        <SensorCard
          title="Irradiance"
          value={displayData.irradiance?.toFixed(0) || '0'}
          unit="W/m²"
          icon={Sun}
          color="purple"
          trend={displayData.irradianceTrend}
          loading={loading && !sensorData.timestamp}
        />
        
        <SensorCard
          title="Efficiency"
          value={displayData.efficiency?.toFixed(1) || '0.0'}
          unit="%"
          icon={TrendingUp}
          color="green"
          trend={displayData.efficiencyTrend}
          loading={loading && !sensorData.timestamp}
        />
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Power & Voltage"
          description="Real-time power output and voltage levels"
          onRefresh={refetch}
          loading={loading && chartData.length === 0}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
                dataKey="power" 
                stroke="#FBBF24" 
                strokeWidth={2}
                dot={false}
                name="Power (kW)"
              />
              <Line 
                type="monotone" 
                dataKey="voltage" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
                name="Voltage (V)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Current & Temperature"
          description="Real-time current flow and panel temperature"
          loading={loading && chartData.length === 0}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
                dataKey="current" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                name="Current (A)"
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#F97316" 
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* System Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today's Energy</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">45.2 kWh</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peak Power</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">5.8 kW</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Alerts</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">3</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Devices Online</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">12/12</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard