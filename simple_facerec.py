import face_recognition
import cv2
import os
import glob
import numpy as np

class SimpleFacerec:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        # Resize frame for a faster speed
        self.frame_resizing = 0.25
        self.detected_faces = set()  # Set za praćenje već detektovanih lica

    def load_encoding_images(self, images_path):
        # Load Images
        images_path = glob.glob(os.path.join(images_path, "*.*"))

        print("{} encoding images found.".format(len(images_path)))

        # Store image encoding and names
        for img_path in images_path:
            if not os.path.exists(img_path):
                print(f"Datoteka ne postoji: {img_path}")
                continue

            img = cv2.imread(img_path)
            if img is None:
                print(f"Greška pri čitanju slike: {img_path}")
                continue

            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Get the filename only from the initial file path.
            basename = os.path.basename(img_path)
            (filename, ext) = os.path.splitext(basename)
            # Get encoding
            face_encodings_list = face_recognition.face_encodings(rgb_img)
            if face_encodings_list:
                img_encoding = face_encodings_list[0]
                self.known_face_encodings.append(img_encoding)
                self.known_face_names.append(filename)
            else:
                # Ovdje možete rukovati situacijom kada lice nije pronađeno na slici
                print("Nije pronađeno lice na slici. {filename}")
                continue
            # Store file name and file encoding
           
        print("Encoding images loaded")

    def detect_known_faces(self, frame):
        if frame is None or frame.shape[0] == 0 or frame.shape[1] == 0:
            print("Empty or invalid frame detected.")
            return None
        
        small_frame = cv2.resize(frame, (0, 0), fx=self.frame_resizing, fy=self.frame_resizing)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        new_faces_detected = False

        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
            name = "Unknown"
            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.known_face_names[best_match_index]
            face_names.append(name)

            if name not in self.detected_faces:
                self.detected_faces.add(name)
                new_faces_detected = True

        if new_faces_detected:
            print("Detecting faces in frame with shape:", rgb_small_frame.shape)

        face_locations = np.array(face_locations)
        face_locations = face_locations / self.frame_resizing
        return face_locations.astype(int), face_names
        
# def print_face_details(name, time_in_seconds, coordinates):
#     print(f"{name} | {time_in_seconds:02d}:{(time_in_seconds % 60):02d} | {coordinates}")
def print_face_details(name, log_time, coordinates):
    print(f"{name} | {log_time} | {coordinates}")
