def detect_anomaly(zones):
    alerts = []
    for zone in zones:
        if zone['density'] > 100:  # overcrowding
            alerts.append({"zone": zone['id'], "type": "overcrowding"})
    return alerts
