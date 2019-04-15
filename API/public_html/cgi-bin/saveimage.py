
import os
import numpy as np
from PIL import Image #pip install pillow
import cv2
import pickle
import urllib.request
import time
import firebase_admin
from firebase_admin import credentials, firestore

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
image_dir = os.path.join(BASE_DIR,"images")


cascade_path = os.path.join(BASE_DIR,'haarcascade_frontalface_alt2.xml')
face_cascade = cv2.CascadeClassifier(cascade_path)
recognizer = cv2.face.LBPHFaceRecognizer_create()

connt = {
  "type": "service_account",
  "project_id": "facedetection-aa172",
  "private_key_id": "998ebafdceb7261bca45f923f0dc777c58a11a3f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDA06TIkeHGXKa7\nMrrsKKFjFekm4RsRglTrUwJ9bD8X9+hobSU7jfWWqPp3yXDyG7sg3UPX3lbVRs/X\nShr/Y3ZH2wB8cdBL8IhYHJZ4Jgkp4k7j6N/W3o4GQRcSg3bimQZpqRcVxCnOzYTS\nodERty3Sq+IRjqfw1cToS+vKXAscovvBuFSgYJfQW+DcVx4Fd6C2JTE1GhltWUd+\nOi5xs427L8MgElMmKqxx1iYD/8mbMvQst7iPCPlHesVPy0zdO7d3vz0AxgstO1sO\nXT9uF0Hjru5A2tdn5yuM4PQYrrlgmHvFv7yrUCXmil7E8+qulSw5KWEBcmwPWfR8\n6xTZYpP7AgMBAAECggEAAxmD3RuHOxaTMZArtA8lJQAdqtvUgRAMyGmhsR1z2DFK\ngZ87iX0LNRxLRnCtCZ9Lf0g/RnGTCMOmJKpSy8cwCBCrrdRwij/4GR6Ahrbpz8wN\nA5njO0OBmfUi50/IsfTOxxUKQ3XPTD0+hNpID5ZXvLq5nBmkdnkhPLC3vh2Dqjan\nT1WK4TZAysp+CDwoKRWcpyNq9yIW5niDFxhg3wtCF4G5RRPy9YZFncXtlqUnxdtt\nwGdDD/aeML2DMGud+2UdwkkvqcNRkhdR1Z6+OonCnGlZLTIwOOc4iPRpudMLEtzW\nunTk0TI8u3n22vdDWKfIezcKOSlg5iTuikABx0vCfQKBgQD5na/9XlAL+WJcCS4x\nk4gfLrgcQxHLiq6kHa5vMpjFxxuSr5zhl0R5tiMLu9i5OS6NWo69bCocztTxkrDy\n9Mjsbfj6vBLt1pHJxtNsFRovVguI879dyh36ApjPQv5QMSu4OA8Ov1EKb3qPjGPe\nTh6WMHHhJKfxKYd1ZLcglBiyXQKBgQDFwiO/cWrR0BoAk+8deOqWm/E/lFfByBRU\nAv+qfSjXkAIEv2FjGyzgd4cIKRxkVg+suV7vauBIJ47hfAaxJFLsOzz5/QTso5ku\n4RhhrU/mKgSyFAkG5fh40V8vWPcG6jD2wS0mbYCFmp0Idt0A2qkYxKv408Z0shq+\neSX5iwUqNwKBgQDyYB9HEpD/T4QmgfOMyAhg3uh+6NEapuq1CO0bpDGbuZ4YbNUU\nZ+FhnW2iMyBZmiCNuOTpIWIy3tL+TsXq461FhfNA4+Ytcy/UkW8xf7wRQqeor6Wd\n2GgLHwJqHk76ZwRguG5Gj5aNX3nOcS936Lrict/hEcrQ7NZPMyBuTd89MQKBgEHM\nvPRAGpjBM0Wp80/NIdEHBhhvlVuG5Sym6sahamt/IQzPWOoO6rmtS6KteyLvd7uy\n2iGzX/jiIKpqCBf8zBKKC1nqlC7gqGFuyBwH/KPKq1FNVUuUTT51+8PXSCpm1e/k\nis9UdAUAUuu0EQjtuIHjPo1GeavubvOdf8MuPIO1AoGARi4tEwyogbfylkkmdtAP\nPdDv+kmiv5tcSSY5AnofU4UXEbdvfeu7FsZqaWx3DTXcQngdZGVYPiVvQwltbg3q\nPMBYiwUG2n402VFveZ19IGlhWO/wiZzXXc756FqEI6212GvUaGPO05sqWBjaecKE\n9NzCzrj2dQpMTVq3awZhZSg=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-u93dg@facedetection-aa172.iam.gserviceaccount.com",
  "client_id": "109730920954551081951",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-u93dg%40facedetection-aa172.iam.gserviceaccount.com"
}


cred = credentials.Certificate(connt)
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

def url_to_image(url):
    # download the image, convert it to a NumPy array, and then read
    # it into OpenCV format
    resp = urllib.request.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    # return the image
    return image

img=[]
urls=[]
empIDs=[]
d = {}
cont = ''
count =-1
a = db.collection(u'urlPictures')
doc_snapshot = a.get()
for doc in doc_snapshot:
    #print(u'{} => {}'.format(doc.id, doc.to_dict()))
    
    urls.append(doc.get(u'url')+",")
    empIDs.append(doc.get(u'empID'))
    d[doc.get(u'empID')] = doc.get(u'url')+","
    print(d)
#print(urls)
b = db.collection(u'loginURLs')
doc_snapshot1 = b.get()
for doc1 in doc_snapshot1:
    img.append(doc1.get(u'url')+",")
    print("found target image")

current_id =0
label_ids = {} #empty dictionary
#training data
y_labels = []
x_train = []
added = False

#time.sleep(3)
for url in urls:
  # download the image URL and display it
    print ("downloading %s" % (url))
    image = url_to_image(url)
    #time.sleep(3)
    #cv2.imshow("window",image)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    countera = 0

    filename = empIDs[countera]
    print("filename" + filename)
    countera = countera+1
    label = filename
    if not label in label_ids:
        label_ids[label] = current_id
        current_id +=1
        print('Adding label ids')

    id_ = label_ids[label]
# pil_image = image.convert("L") #convert L is grayscale
# print(pil_image)
    image_array = np.array(gray_image, "uint8")
    print(id_)
    print(image_array)
#image = io.imread('https://raw2.github.com/scikit-image/scikit-image.github.com/master/_static/img/logo.png')
    faces = face_cascade.detectMultiScale(image_array, scaleFactor=1.5, minNeighbors=5)
    print('Detecting faces')
      
    for(x,y,w,h) in faces:
      roi = image_array[y:y+h, x:x+w]
      x_train.append(roi)
      y_labels.append(id_)
      added=True
      print('Added face')


#saving label ids using pickle
with open("labels.pickle", "wb") as f: #wb writing bytes
  pickle.dump(label_ids,f)

if(added == True):
  print('Training facial data')
  recognizer.train(x_train, np.array(y_labels))
  recognizer.save('trainery.yml')
  print('Facial data saved .yml file created')
  quit()
else:
  print('no face detected')
  docRef = db.collection(u'Fail').document()
  docRef.set({
      u'empID': filename,
      u'isFail': "true"
  })
  quit()