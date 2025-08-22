from ultralytics import YOLO
import cv2

# Load YOLOv8 model (custom trained for fights/theft if available)
model = YOLO('yolov8n.pt')  # or yolov8n.yaml for custom classes

def detect_events(frame):
    results = model.predict(source=frame)
    alerts = []
    for r in results:
        for det in r.boxes:
            cls_id = int(det.cls[0])
            if cls_id in [1,2]:  # class 1=fight, 2=theft (example)
                alerts.append({"type": "violence", "coords": det.xyxy[0].tolist()})
    return alerts

# Real-time detection from camera
def camera_stream(video_source=0):
    cap = cv2.VideoCapture(video_source)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        alerts = detect_events(frame)
        yield frame, alerts
