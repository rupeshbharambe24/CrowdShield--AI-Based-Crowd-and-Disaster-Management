"""
Video Utility
- Frame reading and preprocessing helpers
"""

import cv2

def load_video(path):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Cannot open video {path}")
    return cap

def read_frame(cap):
    ret, frame = cap.read()
    if not ret:
        return None
    return frame

def resize_frame(frame, width=640):
    h, w, _ = frame.shape
    scale = width / w
    height = int(h * scale)
    return cv2.resize(frame, (width, height))
