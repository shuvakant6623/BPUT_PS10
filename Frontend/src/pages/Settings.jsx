import { useState } from 'react'
import { Save, RefreshCw, Bell, Wifi, Database, Shield } from 'lucide-react'
import { settingsAPI } from '../services/api'
import { useFetch } from '../hooks/useFetch'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  // Fetch settings
  const { data: settingsData, loading, refetch } = useFetch(
    () => settingsAPI.get(),
    [],
    true
  )

  // Form states
  const [apiUrl, setApiUrl] = useState('http://localhost:5500/api')
  const [wsUrl, setWsUrl] = useState('ws://localhost:5500/live-data')
  const [refreshInterval, setRefreshInterval] = useState('5')
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)

  // Threshold states
  const [tempThreshold, setTempThreshold] = useState('75')
  const [efficiencyThreshold, setEfficiencyThreshold] = useState('15')
  const [voltageMin, setVoltageMin] = useState('220')
  const [voltageMax, setVoltageMax] = useState('250')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await settingsAPI.update({
        apiUrl,
        wsUrl,
        refreshInterval: parseInt(refreshInterval),
        notifications: {
          enabled: enableNotifications,
          email: emailNotifications,
          critical: criticalAlerts,
        },
        thresholds: {
          temperature: parseInt(tempThreshold),
          efficiency: parseInt(efficiencyThreshold),
          voltageMin: parseInt(voltageMin),
          voltageMax: parseInt(voltageMax),
        },
      })
      alert('Settings saved successfully!')
      refetch()
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'thresholds', label: 'Thresholds', icon: Shield },
    { id: 'connection', label: 'Connection', icon: Wifi },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure system parameters and preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                General Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="input-field"
                    min="1"
                    max="60"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    How often to fetch data from the backend (1-60 seconds)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    System Timezone
                  </label>
                  <select className="input-field">
                    <option>UTC+05:30 (Asia/Kolkata)</option>
                    <option>UTC+00:00 (GMT)</option>
                    <option>UTC-05:00 (EST)</option>
                    <option>UTC-08:00 (PST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Format
                  </label>
                  <select className="input-field">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select className="input-field">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Enable Notifications
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive alerts and system notifications
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableNotifications}
                      onChange={(e) => setEnableNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send alerts to your email address
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Critical Alerts Only
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Only notify for critical system alerts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={criticalAlerts}
                      onChange={(e) => setCriticalAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thresholds Settings */}
        {activeTab === 'thresholds' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Alert Thresholds
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(e.target.value)}
                    className="input-field"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Alert when panel temperature exceeds this value
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Efficiency (%)
                  </label>
                  <input
                    type="number"
                    value={efficiencyThreshold}
                    onChange={(e) => setEfficiencyThreshold(e.target.value)}
                    className="input-field"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Alert when efficiency drops below this value
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Voltage (V)
                    </label>
                    <input
                      type="number"
                      value={voltageMin}
                      onChange={(e) => setVoltageMin(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Voltage (V)
                    </label>
                    <input
                      type="number"
                      value={voltageMax}
                      onChange={(e) => setVoltageMax(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Power Drop Threshold (%)
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    className="input-field"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Alert when power output drops by this percentage
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> These thresholds are used by the ML model to generate predictive maintenance alerts. Adjusting them may affect the sensitivity of the alert system.
              </p>
            </div>
          </div>
        )}

        {/* Connection Settings */}
        {activeTab === 'connection' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                API & WebSocket Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backend API URL
                  </label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="input-field font-mono text-sm"
                    placeholder="http://localhost:5500/api"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Base URL for the backend API server
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WebSocket URL
                  </label>
                  <input
                    type="text"
                    value={wsUrl}
                    onChange={(e) => setWsUrl(e.target.value)}
                    className="input-field font-mono text-sm"
                    placeholder="ws://localhost:5500/live-data"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    WebSocket endpoint for real-time sensor data
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Connection Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    className="input-field"
                    min="5"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Retry Attempts
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    className="input-field"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Number of connection retry attempts before giving up
                  </p>
                </div>

                <div className="pt-4">
                  <button className="btn-secondary w-full">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> Changing these settings may disrupt the connection to your IoT devices. Make sure to verify the URLs before saving.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sensor Calibration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sensor Calibration
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Adjust calibration values for individual sensors to improve accuracy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Device
              </label>
              <select className="input-field">
                <option>PV-001 - Panel Array A</option>
                <option>PV-002 - Panel Array B</option>
                <option>INV-001 - Main Inverter</option>
                <option>SENS-001 - Weather Station</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Calibration Factor
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="1.00"
                className="input-field"
              />
            </div>
          </div>

          <button className="btn-primary">
            Apply Calibration
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Clear Cache
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remove cached data and temporary files
              </p>
            </div>
            <button className="btn-secondary">
              Clear
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Export Historical Data
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download all historical sensor data as CSV
              </p>
            </div>
            <button className="btn-secondary">
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">
                Reset All Settings
              </p>
              <p className="text-sm text-red-700 dark:text-red-200">
                Restore default configuration (cannot be undone)
              </p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings