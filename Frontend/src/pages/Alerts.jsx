import { useState } from 'react'
import { Filter, Search, RefreshCw } from 'lucide-react'
import AlertCard from '../components/AlertCard'
import { alertsAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'

const Alerts = () => {
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch alerts
  const { data: alertsData, loading, refetch } = useFetch(
    () => alertsAPI.getAll(),
    [],
    true
  )

  // Mock alerts for demonstration
  const mockAlerts = alertsData || [
    {
      id: 1,
      type: 'Performance Degradation',
      severity: 'warning',
      message: 'Panel efficiency dropped below 18%. Possible dust accumulation detected.',
      timestamp: '2025-10-19T10:30:00',
      acknowledged: false,
      deviceId: 'PV-001',
    },
    {
      id: 2,
      type: 'Temperature Alert',
      severity: 'critical',
      message: 'Panel temperature exceeds 75°C. Immediate inspection recommended.',
      timestamp: '2025-10-19T09:15:00',
      acknowledged: false,
      deviceId: 'PV-003',
    },
    {
      id: 3,
      type: 'Voltage Fluctuation',
      severity: 'warning',
      message: 'Voltage variations detected. Grid connection may be unstable.',
      timestamp: '2025-10-19T08:45:00',
      acknowledged: true,
      deviceId: 'INV-002',
    },
    {
      id: 4,
      type: 'Maintenance Due',
      severity: 'info',
      message: 'Scheduled maintenance for Panel Array A due in 3 days.',
      timestamp: '2025-10-19T07:00:00',
      acknowledged: false,
      deviceId: 'PV-005',
    },
    {
      id: 5,
      type: 'Predictive Alert',
      severity: 'warning',
      message: 'ML model predicts potential inverter failure within 48 hours.',
      timestamp: '2025-10-18T16:20:00',
      acknowledged: false,
      deviceId: 'INV-001',
    },
    {
      id: 6,
      type: 'Connection Loss',
      severity: 'critical',
      message: 'Lost connection with sensor PV-008. Check network connectivity.',
      timestamp: '2025-10-18T14:10:00',
      acknowledged: true,
      deviceId: 'PV-008',
    },
  ]

  // Filter alerts
  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'unread' && !alert.acknowledged) ||
      (filterStatus === 'read' && alert.acknowledged)
    const matchesSearch = 
      searchQuery === '' ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSeverity && matchesStatus && matchesSearch
  })

  const handleAcknowledge = async (alertId) => {
    try {
      await alertsAPI.acknowledge(alertId)
      refetch()
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const acknowledgeAll = async () => {
    const unacknowledged = filteredAlerts.filter(a => !a.acknowledged)
    try {
      await Promise.all(unacknowledged.map(alert => alertsAPI.acknowledge(alert.id)))
      refetch()
    } catch (error) {
      console.error('Failed to acknowledge alerts:', error)
    }
  }

  const criticalCount = mockAlerts.filter(a => a.severity === 'critical' && !a.acknowledged).length
  const warningCount = mockAlerts.filter(a => a.severity === 'warning' && !a.acknowledged).length
  const unreadCount = mockAlerts.filter(a => !a.acknowledged).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Alerts & Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Predictive maintenance alerts and system notifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={acknowledgeAll}
              className="btn-primary"
            >
              Acknowledge All ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Critical Alerts
              </p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                {criticalCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">{criticalCount}</span>
            </div>
          </div>
        </div>

        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Warnings
              </p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                {warningCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">{warningCount}</span>
            </div>
          </div>
        </div>

        <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Unread
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {unreadCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">{unreadCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="input-field"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Acknowledged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? 's' : ''}
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No alerts found matching your filters
            </p>
          </div>
        ) : (
          <div>
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Alert Distribution
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Critical</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {((criticalCount / mockAlerts.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(criticalCount / mockAlerts.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Warning</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {((warningCount / mockAlerts.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(warningCount / mockAlerts.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Info</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(((mockAlerts.length - criticalCount - warningCount) / mockAlerts.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${((mockAlerts.length - criticalCount - warningCount) / mockAlerts.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Alerts Today</span>
              <span className="font-semibold text-gray-900 dark:text-white">{mockAlerts.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Acknowledged</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {mockAlerts.filter(a => a.acknowledged).length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Response Time (Avg)</span>
              <span className="font-semibold text-gray-900 dark:text-white">12 min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Resolution Rate</span>
              <span className="font-semibold text-green-600 dark:text-green-400">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts