// ========================================
// SOLAR PV INTELLIGENT MONITORING SYSTEM
// Main JavaScript Controller
// ========================================

// Global configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api', // Replace with your backend URL
    WS_URL: 'ws://localhost:3000/ws', // Replace with your WebSocket URL
    UPDATE_INTERVAL: 5000, // 5 seconds
    CHART_MAX_POINTS: 20
};

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, themeIcon);
        });
    }
}

function updateThemeIcon(theme, iconElement) {
    if (iconElement) {
        iconElement.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Update last update timestamp
function updateTimestamp() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdateElement.textContent = timeString;
    }
}

// Initialize Dashboard
function initializeDashboard() {
    initializeTheme();
    initializeCharts();
    updateTimestamp();
    
    // Update timestamp every second
    setInterval(updateTimestamp, 1000);
    
    // Update dashboard data periodically
    setInterval(() => {
        updateDashboardData();
    }, CONFIG.UPDATE_INTERVAL);
}

// Chart instances storage
const chartInstances = {};

// Initialize all charts
function initializeCharts() {
    // Power Generation Chart
    const powerCtx = document.getElementById('powerChart');
    if (powerCtx) {
        chartInstances.powerChart = createLineChart(powerCtx, 'Power Generation', 'rgba(34, 211, 238, 1)', 'rgba(34, 211, 238, 0.2)');
    }
    
    // Efficiency Chart
    const efficiencyCtx = document.getElementById('efficiencyChart');
    if (efficiencyCtx) {
        chartInstances.efficiencyChart = createLineChart(efficiencyCtx, 'Efficiency', 'rgba(250, 204, 21, 1)', 'rgba(250, 204, 21, 0.2)');
    }
    
    // Temperature Chart
    const temperatureCtx = document.getElementById('temperatureChart');
    if (temperatureCtx) {
        chartInstances.temperatureChart = createLineChart(temperatureCtx, 'Temperature', 'rgba(239, 68, 68, 1)', 'rgba(239, 68, 68, 0.2)');
    }
    
    // Irradiance Chart
    const irradianceCtx = document.getElementById('irradianceChart');
    if (irradianceCtx) {
        chartInstances.irradianceChart = createLineChart(irradianceCtx, 'Irradiance', 'rgba(56, 189, 248, 1)', 'rgba(56, 189, 248, 0.2)');
    }
    
    // Populate with mock data initially
    populateChartsWithMockData();
}

// Create a line chart
function createLineChart(ctx, label, borderColor, backgroundColor) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Update chart with new data point
function updateChart(chartInstance, label, value) {
    if (!chartInstance) return;
    
    chartInstance.data.labels.push(label);
    chartInstance.data.datasets[0].data.push(value);
    
    // Keep only last N points
    if (chartInstance.data.labels.length > CONFIG.CHART_MAX_POINTS) {
        chartInstance.data.labels.shift();
        chartInstance.data.datasets[0].data.shift();
    }
    
    chartInstance.update();
}

// Populate charts with mock data for demo
function populateChartsWithMockData() {
    const now = new Date();
    
    for (let i = CONFIG.CHART_MAX_POINTS; i > 0; i--) {
        const time = new Date(now - i * 30000); // 30 seconds intervals
        const timeLabel = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        if (chartInstances.powerChart) {
            updateChart(chartInstances.powerChart, timeLabel, (Math.random() * 2 + 3).toFixed(2));
        }
        
        if (chartInstances.efficiencyChart) {
            updateChart(chartInstances.efficiencyChart, timeLabel, (Math.random() * 10 + 85).toFixed(1));
        }
        
        if (chartInstances.temperatureChart) {
            updateChart(chartInstances.temperatureChart, timeLabel, (Math.random() * 10 + 35).toFixed(1));
        }
        
        if (chartInstances.irradianceChart) {
            updateChart(chartInstances.irradianceChart, timeLabel, (Math.random() * 200 + 700).toFixed(0));
        }
    }
}

// Update dashboard data (called periodically)
function updateDashboardData() {
    // Generate new data point
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Update charts with simulated real-time data
    if (chartInstances.powerChart) {
        updateChart(chartInstances.powerChart, timeLabel, (Math.random() * 2 + 3).toFixed(2));
    }
    
    if (chartInstances.efficiencyChart) {
        updateChart(chartInstances.efficiencyChart, timeLabel, (Math.random() * 10 + 85).toFixed(1));
    }
    
    if (chartInstances.temperatureChart) {
        updateChart(chartInstances.temperatureChart, timeLabel, (Math.random() * 10 + 35).toFixed(1));
    }
    
    if (chartInstances.irradianceChart) {
        updateChart(chartInstances.irradianceChart, timeLabel, (Math.random() * 200 + 700).toFixed(0));
    }
}

// Load sensor cards
function loadSensorCards() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;
    
    // Mock sensor data - Replace with actual API call
    const sensorData = [
        { icon: '⚡', title: 'Total Power', value: '48.5', unit: 'kW', color: 'cyan' },
        { icon: '🌡️', title: 'Avg Temperature', value: '42.3', unit: '°C', color: 'danger' },
        { icon: '☀️', title: 'Solar Irradiance', value: '856', unit: 'W/m²', color: 'yellow' },
        { icon: '📊', title: 'System Efficiency', value: '92.8', unit: '%', color: 'success' }
    ];
    
    statsGrid.innerHTML = sensorData.map(sensor => createSensorCard(sensor)).join('');
}

// Create sensor card HTML
function createSensorCard(sensor) {
    const colorClasses = {
        cyan: 'text-cyan',
        yellow: 'text-yellow',
        danger: 'text-danger',
        success: 'text-success'
    };
    
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${sensor.title}</h3>
                <span class="card-icon">${sensor.icon}</span>
            </div>
            <div class="card-body">
                <div style="font-size: 2.5rem; font-weight: 900;" class="${colorClasses[sensor.color]}">
                    ${sensor.value}<span style="font-size: 1.2rem; margin-left: 0.3rem;">${sensor.unit}</span>
                </div>
            </div>
        </div>
    `;
}

// Load alerts
function loadAlerts() {
    const alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) return;
    
    // Mock alerts data - Replace with actual API call
    const alerts = [
        { 
            severity: 'warning', 
            title: 'Panel Array B2 - Efficiency Drop Detected', 
            message: 'Efficiency has dropped to 78.3%. Recommend inspection within 48 hours.',
            time: '15 minutes ago',
            icon: '⚠️'
        },
        { 
            severity: 'danger', 
            title: 'Panel Array D2 - Connection Lost', 
            message: 'Device has been offline for 2 hours. Immediate attention required.',
            time: '2 hours ago',
            icon: '🔴'
        },
        { 
            severity: 'success', 
            title: 'Predictive Maintenance Scheduled', 
            message: 'AI model predicts optimal cleaning time for Panel Array A1 in 3 days.',
            time: '1 day ago',
            icon: '✅'
        }
    ];
    
    alertsContainer.innerHTML = alerts.map(alert => createAlertCard(alert)).join('');
}

// Create alert card HTML
function createAlertCard(alert) {
    const severityColors = {
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        success: 'var(--success)'
    };
    
    return `
        <div class="alert-item" style="display: flex; gap: 1rem; padding: 1rem; margin-bottom: 1rem; background: rgba(30, 41, 59, 0.4); border-left: 4px solid ${severityColors[alert.severity]}; border-radius: 8px; transition: all 0.3s;">
            <div style="font-size: 1.5rem;">${alert.icon}</div>
            <div style="flex: 1;">
                <h4 style="color: ${severityColors[alert.severity]}; margin-bottom: 0.5rem; font-weight: 700;">${alert.title}</h4>
                <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">${alert.message}</p>
                <span style="font-size: 0.85rem; color: var(--cool-gray);">${alert.time}</span>
            </div>
        </div>
    `;
}

// Utility function to format numbers
function formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    
    // Check if we're on dashboard page
    if (document.getElementById('powerChart')) {
        // Dashboard-specific initialization is handled in dashboard.html
    }
});