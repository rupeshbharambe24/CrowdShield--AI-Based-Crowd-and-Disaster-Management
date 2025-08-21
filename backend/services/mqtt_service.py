"""
MQTT Service
- Publishes incidents/metrics to an MQTT broker
- Useful for IoT integration (e.g., gate sensors)
"""

import json
import paho.mqtt.client as mqtt

class MQTTService:
    def __init__(self, broker="localhost", port=1883, topic="crowdshield/alerts"):
        self.client = mqtt.Client()
        self.client.connect(broker, port, 60)
        self.topic = topic

    def publish(self, data: dict):
        payload = json.dumps(data)
        self.client.publish(self.topic, payload)
