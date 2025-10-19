import { useEffect, useState, useCallback } from 'react'
import socketService from '../services/socket'

/**
 * Custom hook for managing WebSocket connections
 * @param {string} event - Event name to listen for
 * @param {function} onMessage - Callback when message received
 * @returns {object} - Connection status and methods
 */
export const useWebSocket = (event = 'message', onMessage = null) => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect()

    // Subscribe to connection status
    const unsubscribeConnection = socketService.subscribe('connection', (data) => {
      setIsConnected(data.status === 'connected')
      if (data.status === 'failed') {
        setError('Connection failed after multiple attempts')
      }
    })

    // Subscribe to error events
    const unsubscribeError = socketService.subscribe('error', (data) => {
      setError(data.error?.message || 'WebSocket error occurred')
    })

    // Subscribe to specified event
    const unsubscribeEvent = socketService.subscribe(event, (data) => {
      setLastMessage(data)
      if (onMessage) {
        onMessage(data)
      }
    })

    // Cleanup on unmount
    return () => {
      unsubscribeConnection()
      unsubscribeError()
      unsubscribeEvent()
    }
  }, [event, onMessage])

  const sendMessage = useCallback((data) => {
    socketService.send(data)
  }, [])

  const reconnect = useCallback(() => {
    socketService.disconnect()
    socketService.connect()
  }, [])

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    reconnect,
  }
}

/**
 * Hook specifically for live sensor data
 */
export const useLiveSensorData = () => {
  const [sensorData, setSensorData] = useState({
    power: 0,
    voltage: 0,
    current: 0,
    temperature: 0,
    irradiance: 0,
    efficiency: 0,
    timestamp: null,
  })

  const handleSensorUpdate = useCallback((data) => {
    setSensorData(prevData => ({
      ...prevData,
      ...data,
      timestamp: new Date().toISOString(),
    }))
  }, [])

  const { isConnected, error, reconnect } = useWebSocket('sensor_update', handleSensorUpdate)

  return {
    sensorData,
    isConnected,
    error,
    reconnect,
  }
}

export default useWebSocket