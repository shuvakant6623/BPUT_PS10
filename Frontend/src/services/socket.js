let socket = null
let reconnectInterval = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 10
const RECONNECT_DELAY = 3000

const SOCKET_URL = 'ws://localhost:5500/live-data'

export const subscribeToLiveData = (callback) => {
  const connect = () => {
    try {
      socket = new WebSocket(SOCKET_URL)

      socket.onopen = () => {
        console.log('WebSocket connected to live data stream')
        reconnectAttempts = 0
        if (reconnectInterval) {
          clearInterval(reconnectInterval)
          reconnectInterval = null
        }
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          callback(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++
          console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`)
          
          reconnectInterval = setTimeout(() => {
            connect()
          }, RECONNECT_DELAY)
        } else {
          console.error('Max reconnection attempts reached')
          callback({ error: 'Connection lost. Please refresh the page.' })
        }
      }
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
    }
  }

  connect()

  return () => {
    if (socket) {
      socket.close()
      socket = null
    }
    if (reconnectInterval) {
      clearInterval(reconnectInterval)
      reconnectInterval = null
    }
    reconnectAttempts = 0
  }
}

export const disconnectSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
  if (reconnectInterval) {
    clearInterval(reconnectInterval)
    reconnectInterval = null
  }
  reconnectAttempts = 0
}

export const getSocketStatus = () => {
  if (!socket) return 'disconnected'
  
  switch (socket.readyState) {
    case WebSocket.CONNECTING:
      return 'connecting'
    case WebSocket.OPEN:
      return 'connected'
    case WebSocket.CLOSING:
      return 'closing'
    case WebSocket.CLOSED:
      return 'closed'
    default:
      return 'unknown'
  }
}