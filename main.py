import cv2
import time
import requests
from simple_facerec import SimpleFacerec, print_face_details
from datetime import datetime


# Funkcija za preuzimanje ID-a korisnika na temelju imena
#def get_user_id_by_name(name):
    #name = name + ".jpg";
def fetch_users():
    try:
        response = requests.get("http://localhost:8080/api/users")
        users = response.json()
        #for user in users:
    #         if user['profilePicture'] == name:
    #             return user['id']
            # spremaju se svi useri i njihovi IDevi i slike u riječnik
        return {user['profilePicture']: user['id'] for user in users}
    except Exception as e:
        print(f"Greška pri preuzimanju korisnika: {e}")
        return {}

# Funkcija za slanje podataka o vremenu prepoznavanja
#def log_detection_time(user_id, time_in_seconds):
   
def log_detection_time(user_id, log_time):
    try:
        url = f"http://localhost:8080/api/loging/userid/{user_id}"
        #data = {"LogDataTime": log_time}
        #response = requests.post(url, json=data)
        #response = requests.post(url, data)
        response = requests.post(url)
        if response.status_code == 200:
            print(f"Uspješno poslan podatak o vremenu: {log_time} za korisnika s ID-om: {user_id}")
        else:
            print(f"Neuspješno slanje podatka, status kod: {response.status_code}")
    except Exception as e:
        print(f"Greška pri slanju podataka: {e}")


# Encode faces from a folder
sfr = SimpleFacerec()
sfr.load_encoding_images(r"C:\Users\Karla\Desktop\ZavrsniGYMCounter\Backend-gymcounter\images" )

users = fetch_users()

# Load Camera
# cap = cv2.VideoCapture(2)

# Load Video File
video_path = r"C:\Users\Karla\Desktop\ZavrsniGYMCounter\Backend-gymcounter\videos\VideoTestTwo.mp4" 
cap = cv2.VideoCapture(video_path)

fps = cap.get(cv2.CAP_PROP_FPS)  # Dobivanje frame rate-a

# Set za praćenje već detektiranih lica
detected_faces = set()

while True:
    # video se dijeli na kadrove
    ret, frame = cap.read()

    # Provjera kraja videa
    if not ret:
        print("Kraj videozapisa ili greška pri čitanju okvira.")
        break
    
    # Provjera je li kadar prazan
    if frame is None or frame.shape[0] == 0 or frame.shape[1] == 0:
        print("Prazan ili neispravan okvir.")
        continue
    
    # Detekcija lica - Moguća je detekcija 2 razlicita lica unutar jednog kadra
    face_locations_and_names = sfr.detect_known_faces(frame) # detekcija lica i imena odvojeno unutar kadra
    if face_locations_and_names is not None:
        face_locations, face_names = face_locations_and_names # value face_locations_and_names se dijeli na 2 odvojene value, locations and names
        new_faces_detected = False
        for face_loc, name in zip(face_locations, face_names): # zip je jer su to dva arraya
            if name not in detected_faces:
                detected_faces.add(name)
                y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]
                cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 2)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)

                #frame_number = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
                #time_in_seconds = int(frame_number / fps)
                #print_face_details(name, time_in_seconds, (x1, y1, x2, y2))

                log_time = datetime.now().strftime('%Y-%m-%d %H:%M')
                print_face_details(name, log_time, (x1, y1, x2, y2))
                
                # Preuzmi ID korisnika iz API-a
                #user_id = get_user_id_by_name(name)
                # Preuzmi ID korisnika iz lokalno pohranjenih podataka
                user_id = users.get(name + ".jpg")  # Dodavanje ekstenzije .jpg za pretragu
                print("Prepoznati user ID: " + str(user_id));
                print("Prepoznato vrijeme ulaska: " + str(log_time));
                if user_id:
                    # Pošalji podatak o vremenu prepoznavanja
                    #log_detection_time(user_id, time_in_seconds)
                    log_detection_time(user_id, log_time)
                new_faces_detected = True

    # prikaz trenutnog okvira, Frame je naziv prozora s video koji se otvori kad se runna program            
    cv2.imshow("Frame", frame)

    if new_faces_detected:
            # Zaustavi video na 2 sekunde
            if cv2.waitKey(2000) == 27:  # 2000 milisekundi = 2 sekunde
                break
    
    key = cv2.waitKey(1)
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()