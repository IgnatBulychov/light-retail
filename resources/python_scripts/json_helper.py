from libfptr10 import IFptr
import json


fptr = IFptr("")

settings = fptr.getSettings()

fptr.open()

isOpened = fptr.isOpened()

print(json.dumps(settings))
