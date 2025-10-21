from flask import Flask, request, jsonify
from monitor import SolarMonitoringSystem, ESP32Interface
import threading, time

app = Flask(__name__)
system = SolarMonitoringSystem("solar_monitoring.db")
esp32 = ESP32Interface(port="/dev/ttyUSB0", baudrate=115200)

def serial_reader():
    if not esp32.connect():
        print("⚠️ Could not connect to ESP32")
        return
    print("📡 Listening for ESP32 data...")
    while True:
        data = esp32.read_data()
        if data:
            try:
                reading_id, alerts = system.process_reading(data)
                print(f"✅ Reading stored (ID: {reading_id}) | {len(alerts)} alerts")
            except Exception as e:
                print(f"Error processing ESP32 data: {e}")
        time.sleep(1)

# Start background thread
threading.Thread(target=serial_reader, daemon=True).start()

@app.route('/')
def home():
    return jsonify({"message": "Solar Monitoring API running"})

@app.route('/readings', methods=['POST'])
def add_reading():
    """Manually push simulated reading"""
    data = request.get_json()
    reading_id, alerts = system.process_reading(data)
    return jsonify({"reading_id": reading_id, "alerts": alerts})

@app.route('/status', methods=['GET'])
def status():
    return jsonify(system.get_system_status())

@app.route('/alerts', methods=['GET'])
def alerts():
    return jsonify(system.db.get_unacknowledged_alerts())

@app.route('/alerts/<int:alert_id>/ack', methods=['POST'])
def acknowledge_alert(alert_id):
    system.db.acknowledge_alert(alert_id)
    return jsonify({"status": "acknowledged", "alert_id": alert_id})

@app.route('/report', methods=['GET'])
def report():
    days = int(request.args.get('days', 7))
    return jsonify(system.generate_report(days=days))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
