import time
import sys

Data = sys.stdin.readline()
print(Data)
if int(Data) == 1000:
    for i in range(10):
        print(i)
        time.sleep(2)

sys.exit()