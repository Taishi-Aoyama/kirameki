import RPi.GPIO as GPIO
import time
import sys

GPIO.setmode(GPIO.BCM)

gp_out = 4
GPIO.setup(gp_out, GPIO.OUT)

servo = GPIO.PWM(gp_out, 50)

servo.start(0)

Data = sys.stdin.readline()
print(Data)
print(12)
if int(Data) == 1000:
    for i in range(10):
        print(i)
        servo.ChangeDutyCycle(2.5)
        time.sleep(0.5)

        servo.ChangeDutyCycle(6.5)
        time.sleep(1)

        servo.ChangeDutyCycle(10.5)
        time.sleep(1)

        servo.ChangeDutyCycle(7.25)
        time.sleep(0.5)

servo.stop()
GPIO.cleanup()