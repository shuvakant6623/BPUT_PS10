# 🌞 Intelligent Solar Monitoring System - Frontend

A modern, real-time React dashboard for monitoring solar photovoltaic systems with IoT sensors and Machine Learning predictions. This system helps reduce 10-30% efficiency loss through predictive maintenance and real-time analytics.

## ✨ Features

- **Real-time Dashboard** - Live sensor data via WebSocket
- **Analytics & Predictions** - ML-powered performance forecasting
- **Alert Management** - Predictive maintenance notifications
- **Device Management** - IoT sensor monitoring and control
- **Dark Mode** - Beautiful light/dark theme toggle
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Interactive Charts** - Recharts-powered visualizations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:5500`
- WebSocket server on `ws://localhost:5500/live-data`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd solar-monitoring-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
solar-monitoring-frontend/
│
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ChartCard.jsx
│   │   ├── SensorCard.jsx
│   │   ├── AlertCard.jsx
│   │   └── ThemeToggle.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── Alerts.jsx
│   │   ├── Devices.jsx
│   │   └── Settings.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useWebSocket.js
│   │   └── useFetch.js
│   ├── services/         # API & WebSocket services
│   │   ├── api.js
│   │   └── socket.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # This file
```

## 🔌 Backend Integration

### API Endpoints

The frontend expects these endpoints from your backend:

#### Sensors
- `GET /api/sensors/current` - Get current sensor readings
- `GET /api/sensors/history` - Get historical data
- `GET /api/sensors/:id` - Get specific sensor data

#### Analytics
- `GET /api/analytics/performance` - Performance metrics
- `GET /api/analytics/predictions` - ML predictions
- `GET /api/analytics/trends` - Trend analysis

#### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts/:id/acknowledge` - Acknowledge alert
- `GET /api/alerts/unread` - Get unread alerts

#### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device details
- `PUT /api/devices/:id` - Update device
- `POST /api/devices/:id/calibrate` - Calibrate device

#### Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/thresholds` - Get alert thresholds
- `PUT /api/settings/thresholds` - Update thresholds

### WebSocket Events

The WebSocket connection expects these event types:

```javascript
// Connection status
{ type: 'connection', payload: { status: 'connected' } }

// Sensor updates
{
  type: 'sensor_update',
  payload: {
    power: 5.2,
    voltage: 235,
    current: 22.1,
    temperature: 42,
    irradiance: 850,
    efficiency: 19.5
  }
}

// Alerts
{
  type: 'alert',
  payload: {
    id: 123,
    severity: 'critical',
    message: 'Temperature threshold exceeded'
  }
}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5500/api
VITE_WS_URL=ws://localhost:5500/live-data
```

### Customization

#### Changing API URLs

Edit `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api'
```

Edit `src/services/socket.js`:
```javascript
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5500/live-data'
```

#### Theme Colors

Modify `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    500: '#f97316', // Change to your brand color
    // ...
  }
}
```

## 📊 Pages Overview

### Dashboard
- Real-time sensor metrics (power, voltage, current, temperature)
- Live charts updating via WebSocket
- System summary cards

### Analytics
- Historical performance graphs
- ML predictions vs actual data
- Monthly trends
- Performance insights

### Alerts
- Predictive maintenance alerts
- Filterable by severity and status
- Acknowledge functionality
- Alert statistics

### Devices
- Connected IoT device list
- Device status monitoring
- Device details modal
- Calibration options

### Settings
- API/WebSocket configuration
- Notification preferences
- Alert thresholds
- Sensor calibration
- Data management

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Adding New Features

1. **Add a new page:**
   - Create component in `src/pages/`
   - Add route in `src/App.jsx`
   - Add navigation item in `src/components/Sidebar.jsx`

2. **Add API endpoint:**
   - Update `src/services/api.js`
   - Create hook in `src/hooks/` if needed

3. **Add WebSocket event:**
   - Update `src/services/socket.js`
   - Handle in `src/hooks/useWebSocket.js`

## 🔧 Troubleshooting

### WebSocket Connection Issues

If WebSocket fails to connect:
1. Verify backend is running on correct port
2. Check `VITE_WS_URL` in `.env`
3. Ensure firewall allows WebSocket connections
4. Check browser console for errors

### API Request Failures

If API requests fail:
1. Verify backend is running
2. Check `VITE_API_URL` in `.env`
3. Check network tab in browser DevTools
4. Verify CORS is configured on backend

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

## 📦 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables for Production

Set these in your hosting platform:
- `VITE_API_URL` - Your production API URL
- `VITE_WS_URL` - Your production WebSocket URL

## 🎨 UI Components

All components are built with:
- **React** - UI library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts
- **React Router** - Routing

## 🤝 Integration Examples

### Connecting to Your Backend

```javascript
// Example backend response format
// GET /api/sensors/current
{
  "success": true,
  "data": {
    "power": 5.2,
    "voltage": 235,
    "current": 22.1,
    "temperature": 42,
    "irradiance": 850,
    "efficiency": 19.5,
    "timestamp": "2025-10-19T11:30:00Z"
  }
}
```

### WebSocket Message Format

```javascript
// Your backend should send messages in this format
ws.send(JSON.stringify({
  type: 'sensor_update',
  payload: {
    power: 5.2,
    voltage: 235,
    // ... other sensor data
  }
}))
```

## 📝 License

This project is part of the Intelligent Solar Monitoring System.

## 🙏 Acknowledgments

- Built with React + Vite
- Styled with Tailwind CSS
- Charts by Recharts
- Icons by Lucide

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.#   B P U T _ P S 1 0  
 