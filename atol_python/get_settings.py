from libfptr10 import IFptr
import json

fptr = IFptr("")

settings = fptr.getSettings()

print(json.dumps(settings))