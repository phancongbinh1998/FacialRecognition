#!C:\Python27\python.exe
print('Content-type: text/html\r\n\r')

import numpy as np
import cv2
import time

cap = cv2.VideoCapture(0) #use camera(laptop cam default)


while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    # Display the resulting frame
    cv2.imshow('frame',frame) #shows video from webcam
    if cv2.waitKey(1) & 0xFF == ord('w'): #take pic with w
        filename = time.strftime("%Y%m%d-%H%M%S")
        cv2.imwrite('images/'+filename+'.png',frame)
        
    if cv2.waitKey(20) & 0xFF == ord('q'): #stop video after pressing q
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
