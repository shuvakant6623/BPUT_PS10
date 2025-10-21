// ========================================
// SOLAR PV INTELLIGENT MONITORING SYSTEM
// WebSocket Connection Handler
// Real-time IoT Data Streaming
// ========================================

// WebSocket connection instance
let socket = null;
let reconnectAttempts = 0;
let maxReconnectAttempts = 5;
let reconnectDelay = 3000; // 3 seconds

// WebSocket configuration
const WS_CONFIG = {
    // TODO: Replace with your actual WebSocket server URL
    url: 'ws://localhost:3000/ws', // Example: 'wss://your-backend.com/ws'
    
    // Reconnection settings
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnects: 5,
    
    // Heartbeat settings (to keep connection alive)
    heartbeatInterval: 30000, // 30 seconds
    heartbeatMessage: JSON.stringify({ type: 'ping' })
};

// Connection status
let connectionStatus = 'disconnected'; // 'connected', 'connecting', 'disconnected', 'error'

/**
 * Initialize WebSocket connection
 * Call this function when the dashboard loads
 */
function startWebSocketConnection() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
    }
    
    connectionStatus = 'connecting';
    updateConnectionIndicator();
    
    try {
        // Create WebSocket connection
        socket = new WebSocket(WS_CONFIG.url);
        
        // Connection opened
        socket.onopen = handleWebSocketOpen;
        
        // Listen for messages
        socket.onmessage = handleWebSocketMessage;
        
        // Connection closed
        socket.onclose = handleWebSocketClose;
        
        // Error occurred
        socket.onerror = handleWebSocketError;
        
    } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        connectionStatus = 'error';
        updateConnectionIndicator();
    }
}

/**
 * Handle WebSocket connection opened
 */
function handleWebSocketOpen(event) {
    console.log('✅ WebSocket connected successfully');
    connectionStatus = 'connected';
    reconnectAttempts = 0;
    updateConnectionIndicator();
    
    // Send initial handshake or authentication if needed
    sendWebSocketMessage({
        type: 'subscribe',
        channels: ['sensors', 'alerts', 'device_status']
    });
    
    // Start heartbeat to keep connection alive
    startHeartbeat();
}

/**
 * Handle incoming WebSocket messages
 */
function handleWebSocketMessage(event) {
    try {
        const data = JSON.parse(event.data);
        console.log('📨 Received data:', data);
        
        // Route message to appropriate handler based on type
        switch (data.type) {
            case 'sensor_data':
                handleSensorData(data.payload);
                break;
            
            case 'device_status':
                handleDeviceStatus(data.payload);
                break;
            
            case 'alert':
                handleAlert(data.payload);
                break;
            
            case 'efficiency_update':
                handleEfficiencyUpdate(data.payload);
                break;
            
            case 'pong':
                // Heartbeat response
                console.log('💓 Heartbeat received');
                break;
            
            default:
                console.warn('Unknown message type:', data.type);
        }
        
    } catch (error) {
        console.error('Error parsing WebSocket message:', error);
    }
}

/**
 * Handle WebSocket connection closed
 */
function handleWebSocketClose(event) {
    console.log('⚠️ WebSocket connection closed', event);
    connectionStatus = 'disconnected';
    updateConnectionIndicator();
    
    // Stop heartbeat
    stopHeartbeat();
    
    // Attempt to reconnect if enabled
    if (WS_CONFIG.autoReconnect && reconnectAttempts < WS_CONFIG.maxReconnects) {
        reconnectAttempts++;
        console.log(`🔄 Attempting to reconnect (${reconnectAttempts}/${WS_CONFIG.maxReconnects})...`);
        
        setTimeout(() => {
            startWebSocketConnection();
        }, WS_CONFIG.reconnectInterval);
    } else {
        console.error('❌ Max reconnection attempts reached');
    }
}

/**
 * Handle WebSocket error
 */
function handleWebSocketError(error) {
    console.error('❌ WebSocket error:', error);
    connectionStatus = 'error';
    updateConnectionIndicator();
}

/**
 * Send message through WebSocket
 */
function sendWebSocketMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.warn('WebSocket not connected. Cannot send message.');
    }
}

/**
 * Close WebSocket connection
 */
function closeWebSocketConnection() {
    if (socket) {
        stopHeartbeat();
        socket.close();
        socket = null;
    }
}

// ========================================
// DATA HANDLERS
// ========================================

/**
 * Handle real-time sensor data
 * Example payload: { deviceId, temperature, voltage, current, irradiance, power, efficiency }
 */
function handleSensorData(data) {
    console.log('🌡️ Sensor data received:', data);
    
    // Update charts with new data
    const timeLabel = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    if (data.power && chartInstances.powerChart) {
        updateChart(chartInstances.powerChart, timeLabel, data.power);
    }
    
    if (data.efficiency && chartInstances.efficiencyChart) {
        updateChart(chartInstances.efficiencyChart, timeLabel, data.efficiency);
    }
    
    if (data.temperature && chartInstances.temperatureChart) {
        updateChart(chartInstances.temperatureChart, timeLabel, data.temperature);
    }
    
    if (data.irradiance && chartInstances.irradianceChart) {
        updateChart(chartInstances.irradianceChart, timeLabel, data.irradiance);
    }
    
    // Update sensor cards if they exist
    updateSensorCards(data);
}

/**
 * Handle device status updates
 * Example payload: { deviceId, status, uptime, lastSeen }
 */
function handleDeviceStatus(data) {
    console.log('🔌 Device status update:', data);
    
    // Update device card if on devices page
    const deviceCard = document.querySelector(`[data-device-id="${data.deviceId}"]`);
    if (deviceCard) {
        // Update status indicator and other fields
        updateDeviceCard(deviceCard, data);
    }
}

/**
 * Handle alert notifications
 * Example payload: { severity, title, message, deviceId }
 */
function handleAlert(data) {
    console.log('🔔 Alert received:', data);
    
    // Add alert to alerts container
    const alertsContainer = document.getElementById('alertsContainer');
    if (alertsContainer) {
        const alertHTML = createAlertCard({
            severity: data.severity,
            title: data.title,
            message: data.message,
            time: 'Just now',
            icon: data.severity === 'danger' ? '🔴' : data.severity === 'warning' ? '⚠️' : '✅'
        });
        
        alertsContainer.insertAdjacentHTML('afterbegin', alertHTML);
    }
    
    // Show browser notification if permission granted
    showBrowserNotification(data.title, data.message);
}

/**
 * Handle efficiency update from AI prediction
 */
function handleEfficiencyUpdate(data) {
    console.log('📊 Efficiency update:', data);
    // Update relevant UI elements with efficiency predictions
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Update sensor cards with new data
 */
function updateSensorCards(data) {
    // This is a helper to update the stat cards on dashboard
    // Implement based on your specific card structure
}

/**
 * Update device card on devices page
 */
function updateDeviceCard(cardElement, data) {
    // Update specific fields in the device card
    // Implement based on your card structure
}

/**
 * Update connection status indicator
 */
function updateConnectionIndicator() {
    const indicator = document.getElementById('connectionStatus');
    if (!indicator) return;
    
    const statusConfig = {
        connected: { text: '🟢 Connected', color: 'var(--success)' },
        connecting: { text: '🟡 Connecting...', color: 'var(--warning)' },
        disconnected: { text: '🔴 Disconnected', color: 'var(--danger)' },
        error: { text: '⚠️ Connection Error', color: 'var(--danger)' }
    };
    
    const config = statusConfig[connectionStatus];
    indicator.textContent = config.text;
    indicator.style.color = config.color;
}

/**
 * Show browser notification
 */
function showBrowserNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
        });
    }
}

/**
 * Request notification permission
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ========================================
// HEARTBEAT MECHANISM
// ========================================

let heartbeatInterval = null;

function startHeartbeat() {
    stopHeartbeat(); // Clear any existing interval
    
    heartbeatInterval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            sendWebSocketMessage({ type: 'ping' });
        }
    }, WS_CONFIG.heartbeatInterval);
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

// ========================================
// AUTO-INITIALIZE
// ========================================

// Request notification permission on load
document.addEventListener('DOMContentLoaded', () => {
    requestNotificationPermission();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    closeWebSocketConnection();
});