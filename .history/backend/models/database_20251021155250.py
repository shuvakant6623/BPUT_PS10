from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, JSON, Text, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import pytz
from datetime import datetime

# Database Configuration
SOLAR_DATABASE_URL = "sqlite:///./backend/data/database/solar_pv_system.db"
METRICS_DATABASE_URL = "sqlite:///./backend/data/database/solar_metrics.db"

solar_engine = create_engine(
    SOLAR_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # only for sqlite
)

metrics_engine = create_engine(
    METRICS_DATABASE_URL,
    connect_args={"check_same_thread": False}  # only for sqlite
)

IST = pytz.timezone('Asia/Kolkata')

Solar_SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=solar_engine)
Solar_Base = declarative_base()

Metrics_SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=metrics_engine)
Metrics_Base = declarative_base()


# ===== SOLAR DEVICES TABLE =====
class SolarDevice(Solar_Base):
    __tablename__ = "solar_devices"
    
    id = Column(String, primary_key=True)  # e.g., 'PV-001'
    name = Column(String, nullable=False)  # e.g., 'Solar Array A1'
    device_type = Column(String, default="solar_panel")
    status = Column(String, default="online")  # online, offline, maintenance
    location_lat = Column(Float)
    location_lon = Column(Float)
    location_name = Column(String)
    
    # Current metrics
    power_output_kw = Column(Float, default=0.0)
    efficiency_percent = Column(Float, default=0.0)
    temperature_celsius = Column(Float, default=0.0)
    voltage = Column(Float, default=0.0)
    current = Column(Float, default=0.0)
    
    # Device specs
    rated_capacity_kw = Column(Float)
    panel_area_m2 = Column(Float)
    installation_date = Column(DateTime)
    
    # Statistics
    uptime_percent = Column(Float, default=100.0)
    total_energy_generated_kwh = Column(Float, default=0.0)
    last_maintenance_date = Column(DateTime)
    
    created_at = Column(DateTime, default=lambda: datetime.now(IST))
    updated_at = Column(DateTime, default=lambda: datetime.now(IST), onupdate=lambda: datetime.now(IST))


# ===== SENSOR READINGS TABLE (Time-series data) =====
class SensorReading(Metrics_Base):
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(IST), index=True)
    
    # Environmental data
    solar_irradiance = Column(Float)  # W/m²
    ambient_temperature = Column(Float)  # °C
    panel_temperature = Column(Float)  # °C
    humidity = Column(Float)  # %
    wind_speed = Column(Float)  # m/s
    
    # Electrical measurements
    power_output_kw = Column(Float)
    voltage = Column(Float)
    current = Column(Float)
    frequency = Column(Float)
    
    # Performance metrics
    efficiency_percent = Column(Float)
    performance_ratio = Column(Float)
    
    # Data quality
    data_quality_score = Column(Float, default=1.0)  # 0-1 scale


# ===== SYSTEM ALERTS TABLE =====
class SystemAlert(Solar_Base):
    __tablename__ = "system_alerts"
    
    id = Column(String, primary_key=True)
    device_id = Column(String, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(IST), index=True)
    
    # Alert details
    metric = Column(String, nullable=False)  # e.g., 'Temperature', 'Power Generation'
    severity = Column(String, nullable=False)  # INFO, WARN, CRITICAL
    value = Column(String)  # Current value that triggered alert
    threshold = Column(String)  # Threshold that was exceeded
    message = Column(Text, nullable=False)
    
    # Alert status
    status = Column(String, default="active")  # active, acknowledged, resolved, dismissed
    acknowledged_by = Column(String)
    acknowledged_at = Column(DateTime)
    resolved_at = Column(DateTime)
    
    # Additional context
    device_name = Column(String)
    location = Column(String)
    metadata = Column(JSON)  # Any additional alert-specific data


# ===== MAINTENANCE LOGS TABLE =====
class MaintenanceLog(Solar_Base):
    __tablename__ = "maintenance_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(IST))
    
    maintenance_type = Column(String, nullable=False)  # scheduled, corrective, predictive
    description = Column(Text)
    performed_by = Column(String)
    
    # Before/after metrics
    efficiency_before = Column(Float)
    efficiency_after = Column(Float)
    power_before = Column(Float)
    power_after = Column(Float)
    
    cost = Column(Float)
    duration_hours = Column(Float)
    parts_replaced = Column(JSON)
    next_maintenance_date = Column(DateTime)
    
    status = Column(String, default="completed")  # scheduled, in_progress, completed


# ===== DAILY STATISTICS TABLE =====
class DailyStatistics(Metrics_Base):
    __tablename__ = "daily_statistics"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, nullable=False, index=True)
    device_id = Column(String, index=True)
    
    # Energy metrics
    total_energy_kwh = Column(Float, default=0.0)
    peak_power_kw = Column(Float)
    average_power_kw = Column(Float)
    
    # Performance metrics
    average_efficiency = Column(Float)
    performance_ratio = Column(Float)
    capacity_factor = Column(Float)
    
    # Environmental conditions
    average_irradiance = Column(Float)
    peak_irradiance = Column(Float)
    average_temperature = Column(Float)
    
    # Financial metrics
    energy_savings_inr = Column(Float)  # In Indian Rupees
    co2_offset_kg = Column(Float)
    
    # Operational metrics
    uptime_hours = Column(Float)
    downtime_hours = Column(Float)
    alert_count = Column(Integer, default=0)


# ===== USER ACTIVITY TABLE =====
class UserActivity(Solar_Base):
    __tablename__ = "user_activity"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, index=True)
    username = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(IST))
    
    activity_type = Column(String, nullable=False)  # login, logout, view_dashboard, export_data, etc.
    page = Column(String)  # dashboard, devices, analytics, alerts
    ip_address = Column(String)
    user_agent = Column(String)
    session_id = Column(String)
    
    # Activity details
    details = Column(JSON)


# ===== WEATHER DATA TABLE =====
class WeatherData(Metrics_Base):
    __tablename__ = "weather_data"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(IST), index=True)
    location = Column(String, nullable=False)
    
    # Weather parameters
    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    wind_direction = Column(Float)
    cloud_cover = Column(Float)
    precipitation = Column(Float)
    pressure = Column(Float)
    
    # Solar-specific
    solar_irradiance = Column(Float)
    uv_index = Column(Float)
    
    # Forecast data
    is_forecast = Column(Boolean, default=False)
    forecast_hours_ahead = Column(Integer)
    
    # Data source
    data_source = Column(String)  # e.g., 'openweathermap', 'local_sensor'


# ===== SYSTEM CONFIGURATION TABLE =====
class SystemConfig(Solar_Base):
    __tablename__ = "system_config"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    config_key = Column(String, unique=True, nullable=False)
    config_value = Column(JSON, nullable=False)
    description = Column(Text)
    updated_at = Column(DateTime, default=lambda: datetime.now(IST), onupdate=lambda: datetime.now(IST))
    updated_by = Column(String)


# Create all tables
Solar_Base.metadata.create_all(bind=solar_engine)
Metrics_Base.metadata.create_all(bind=metrics_engine)


# ===== HELPER FUNCTIONS =====

def get_solar_db():
    """Dependency for solar database session"""
    db = Solar_SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_metrics_db():
    """Dependency for metrics database session"""
    db = Metrics_SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_default_config(db):
    """Initialize default system configuration"""
    default_configs = [
        {
            "config_key": "alert_thresholds",
            "config_value": {
                "low_irradiance": 50,
                "low_irradiance_duration": 3,
                "power_drop_percent": 40,
                "high_temp": 75,
                "low_efficiency": 10
            },
            "description": "Alert threshold values for system monitoring"
        },
        {
            "config_key": "energy_rate",
            "config_value": {"rate_per_kwh_inr": 7.5},
            "description": "Electricity rate in INR per kWh for savings calculation"
        },
        {
            "config_key": "co2_factor",
            "config_value": {"kg_per_kwh": 0.82},
            "description": "CO2 emission factor in kg per kWh"
        },
        {
            "config_key": "maintenance_schedule",
            "config_value": {
                "panel_cleaning_days": 90,
                "inspection_days": 180,
                "major_service_days": 365
            },
            "description": "Maintenance schedule intervals in days"
        }
    ]
    
    for config in default_configs:
        existing = db.query(SystemConfig).filter_by(config_key=config["config_key"]).first()
        if not existing:
            db.add(SystemConfig(**config))
    
    db.commit()