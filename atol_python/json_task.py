from libfptr10 import IFptr
import sys
import json

fptr = IFptr("")

LIBFPTR_SETTING_MODEL = json.dumps(sys.argv[1]).replace('"','')
LIBFPTR_SETTING_PORT = json.dumps(sys.argv[2]).replace('"','')
LIBFPTR_SETTING_COM_FILE = json.dumps(sys.argv[3]).replace('"','')
LIBFPTR_SETTING_COM_FILE = LIBFPTR_SETTING_COM_FILE.replace('COM','')
LIBFPTR_SETTING_BAUDRATE = json.dumps(sys.argv[4]).replace('"','')
LIBFPTR_SETTING_IPADDRESS = json.dumps(sys.argv[5]).replace('"','')
LIBFPTR_SETTING_IPPORT = json.dumps(sys.argv[6]).replace('"','')


if LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_AUTO':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_AUTO)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_1F':
    model = IFptr.LIBFPTR_MODEL_ATOL_1F
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_11F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_11F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_20F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_20F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_22F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_22F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_25F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_25F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_27F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_27F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_30F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_30F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_42FS':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_42F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_50F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_50F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_52F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_52F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_60F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_60F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_77F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_77F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_90F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_90F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_91F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_91F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_92F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_92F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_SIGMA_10':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_SIGMA_10)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_SIGMA_7F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_SIGMA_7F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_ATOL_SIGMA_8F':
    model = str(IFptr.LIBFPTR_MODEL_ATOL_SIGMA_8F)
elif LIBFPTR_SETTING_MODEL == 'LIBFPTR_MODEL_KAZNACHEY_FA':
    model = str(IFptr.LIBFPTR_MODEL_KAZNACHEY_FA)
else:
    model = str(IFptr.LIBFPTR_MODEL_ATOL_AUTO)


if LIBFPTR_SETTING_PORT == 'LIBFPTR_PORT_COM':
    port = str(IFptr.LIBFPTR_PORT_COM)
elif LIBFPTR_SETTING_PORT == 'LIBFPTR_PORT_USB':
    port = str(IFptr.LIBFPTR_PORT_USB)
elif LIBFPTR_SETTING_PORT == 'LIBFPTR_PORT_TCPIP':
    port = str(IFptr.LIBFPTR_PORT_TCPIP)
elif LIBFPTR_SETTING_PORT == 'LIBFPTR_PORT_BLUETOOTH':
    port = str(IFptr.LIBFPTR_PORT_BLUETOOTH)
else:
    port = str(IFptr.LIBFPTR_PORT_COM)


if LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_1200':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_1200)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_2400':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_2400)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_4800':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_4800)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_9600':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_9600)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_19200':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_19200)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_38400':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_38400)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_57600':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_57600)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_115200':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_115200)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_230400':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_230400)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_460800':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_460800)
elif LIBFPTR_SETTING_BAUDRATE == 'LIBFPTR_PORT_BR_460800':
    baudrate = str(IFptr.LIBFPTR_PORT_BR_19200)
else:
    baudrate = str(IFptr.LIBFPTR_PORT_BR_115200)
    


fptr.setSingleSetting(IFptr.LIBFPTR_SETTING_MODEL, model)
fptr.setSingleSetting(IFptr.LIBFPTR_SETTING_PORT, port)
fptr.setSingleSetting(IFptr.LIBFPTR_SETTING_COM_FILE, LIBFPTR_SETTING_COM_FILE)
fptr.setSingleSetting(IFptr.LIBFPTR_SETTING_BAUDRATE, baudrate),
fptr.setSingleSetting(IFptr.LIBFPTR_SETTING_IPADDRESS, LIBFPTR_SETTING_IPADDRESS),
fptr.setSingleSetting(IFptr.LIBFPTR_SETTING_IPPORT, LIBFPTR_SETTING_IPPORT)

success = fptr.applySingleSettings()

#print(sys.argv[7])

fptr.open()

if fptr.isOpened() != 1:
    fptr.close()
    print('connectionFailed')
else:
    jsonTask = sys.argv[7]
    fptr.setParam(IFptr.LIBFPTR_PARAM_JSON_DATA, jsonTask)
    result1 = fptr.processJson()
    if result1 == -1:
        fptr.close()
        print('error')
    else:
        result = fptr.getParamString(IFptr.LIBFPTR_PARAM_JSON_DATA)
        fptr.close()
        print(json.dumps(result))
        