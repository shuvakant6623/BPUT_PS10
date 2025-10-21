// ========================================
// SOLAR PV INTELLIGENT MONITORING SYSTEM
// REST API Fetch Utility
// HTTP Request Handler
// ========================================

/**
 * API Configuration
 * TODO: Replace with your actual backend API URL
 */
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api', // Example: 'https://your-backend.com/api'
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': 'Bearer YOUR_TOKEN'
    }
};

/**
 * Main fetch wrapper function
 * Handles all HTTP requests with error handling and timeout
 * 
 * @param {string} endpoint - API endpoint (e.g., '/devices', '/sensors')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} - Promise with response data or error
 */
async function useFetch(endpoint, options = {}) {
    // Build full URL
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    // Default options
    const defaultOptions = {
        method: 'GET',
        headers: { ...API_CONFIG.headers },
        mode: 'cors',
        cache: 'no-cache'
    };
    
    // Merge options
    const fetchOptions = { ...defaultOptions, ...options };
    
    // Add body if present and not GET request
    if (options.body && fetchOptions.method !== 'GET') {
        fetchOptions.body = JSON.stringify(options.body);
    }
    
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        fetchOptions.signal = controller.signal;
        
        // Make the request
        const response = await fetch(url, fetchOptions);
        
        clearTimeout(timeoutId);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        
        return {
            success: true,
            data: data,
            status: response.status
        };
        
    } catch (error) {
        console.error('API Fetch Error:', error);
        
        // Handle different error types
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: 'Request timeout',
                message: 'The request took too long to complete'
            };
        }
        
        return {
            success: false,
            error: error.message,
            message: 'Failed to fetch data from server'
        };
    }
}

// ========================================
// CONVENIENCE METHODS
// ========================================

/**
 * GET request
 */
async function fetchGET(endpoint) {
    return await useFetch(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
async function fetchPOST(endpoint, data) {
    return await useFetch(endpoint, {
        method: 'POST',
        body: data
    });
}

/**
 * PUT request
 */
async function fetchPUT(endpoint, data) {
    return await useFetch(endpoint, {
        method: 'PUT',
        body: data
    });
}

/**
 * DELETE request
 */
async function fetchDELETE(endpoint) {
    return await useFetch(endpoint, { method: 'DELETE' });
}

/**
 * PATCH request
 */
async function fetchPATCH(endpoint, data) {
    return await useFetch(endpoint, {
        method: 'PATCH',
        body: data
    });
}

// ========================================
// API ENDPOINTS - SOLAR PV SPECIFIC
// ========================================

/**
 * Fetch all devices
 * GET /devices
 */
async function fetchDevices() {
    return await fetchGET('/devices');
}

/**
 * Fetch single device by ID
 * GET /devices/:id
 */
async function fetchDeviceById(deviceId) {
    return await fetchGET(`/devices/${deviceId}`);
}

/**
 * Fetch real-time sensor data
 * GET /sensors/realtime
 */
async function fetchSensorData() {
    return await fetchGET('/sensors/realtime');
}

/**
 * Fetch historical sensor data
 * GET /sensors/history?deviceId=X&startDate=Y&endDate=Z
 */
async function fetchSensorHistory(deviceId, startDate, endDate) {
    const params = new URLSearchParams({
        deviceId,
        startDate,
        endDate
    });
    return await fetchGET(`/sensors/history?${params}`);
}

/**
 * Fetch system alerts
 * GET /alerts
 */
async function fetchAlerts(limit = 10) {
    return await fetchGET(`/alerts?limit=${limit}`);
}

/**
 * Fetch efficiency predictions from AI model
 * GET /predictions/efficiency
 */
async function fetchEfficiencyPredictions() {
    return await fetchGET('/predictions/efficiency');
}

/**
 * Fetch system analytics
 * GET /analytics/overview
 */
async function fetchAnalytics() {
    return await fetchGET('/analytics/overview');
}

/**
 * Update device configuration
 * PUT /devices/:id/config
 */
async function updateDeviceConfig(deviceId, config) {
    return await fetchPUT(`/devices/${deviceId}/config`, config);
}

/**
 * Reset device
 * POST /devices/:id/reset
 */
async function resetDevice(deviceId) {
    return await fetchPOST(`/devices/${deviceId}/reset`, {});
}

/**
 * Mark alert as read
 * PATCH /alerts/:id
 */
async function markAlertAsRead(alertId) {
    return await fetchPATCH(`/alerts/${alertId}`, { read: true });
}

/**
 * Delete alert
 * DELETE /alerts/:id
 */
async function deleteAlert(alertId) {
    return await fetchDELETE(`/alerts/${alertId}`);
}

/**
 * Fetch weather data for location
 * GET /weather/:location
 */
async function fetchWeatherData(location) {
    return await fetchGET(`/weather/${location}`);
}

// ========================================
// EXAMPLE USAGE
// ========================================

/**
 * Example: Fetch and display devices
 */
async function exampleFetchDevices() {
    const result = await fetchDevices();
    
    if (result.success) {
        console.log('Devices:', result.data);
        // Process and display devices
        return result.data;
    } else {
        console.error('Failed to fetch devices:', result.error);
        // Show error message to user
        showErrorNotification(result.message);
        return [];
    }
}

/**
 * Example: Update device and handle response
 */
async function exampleUpdateDevice(deviceId, newConfig) {
    const result = await updateDeviceConfig(deviceId, newConfig);
    
    if (result.success) {
        console.log('Device updated successfully');
        showSuccessNotification('Device configuration updated');
        return true;
    } else {
        console.error('Failed to update device:', result.error);
        showErrorNotification('Failed to update device configuration');
        return false;
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Show success notification
 */
function showSuccessNotification(message) {
    // Implement your notification system here
    console.log('✅ Success:', message);
    // Example: create a toast notification
}

/**
 * Show error notification
 */
function showErrorNotification(message) {
    // Implement your notification system here
    console.error('❌ Error:', message);
    // Example: create a toast notification
}

/**
 * Retry failed request with exponential backoff
 */
async function retryFetch(fetchFunction, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        const result = await fetchFunction();
        
        if (result.success) {
            return result;
        }
        
        if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
    
    return { success: false, error: 'Max retries reached' };
}

// ========================================
// POLLING MECHANISM
// ========================================

/**
 * Poll an endpoint at regular intervals
 * Useful for endpoints that don't support WebSocket
 */
class APIPoller {
    constructor(endpoint, callback, interval = 5000) {
        this.endpoint = endpoint;
        this.callback = callback;
        this.interval = interval;
        this.intervalId = null;
        this.isPolling = false;
    }
    
    start() {
        if (this.isPolling) return;
        
        this.isPolling = true;
        this.poll(); // Initial call
        
        this.intervalId = setInterval(() => {
            this.poll();
        }, this.interval);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isPolling = false;
    }
    
    async poll() {
        const result = await fetchGET(this.endpoint);
        
        if (result.success) {
            this.callback(result.data);
        }
    }
}

// Example usage of poller:
// const sensorPoller = new APIPoller('/sensors/realtime', (data) => {
//     console.log('Sensor data:', data);
//     updateDashboard(data);
// }, 5000);
// sensorPoller.start();

// Export for use in other files (if using modules)
// export { useFetch, fetchGET, fetchPOST, fetchDevices, fetchSensorData, APIPoller };