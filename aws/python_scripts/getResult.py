import sys
import json
import os.path

if len(sys.argv) >= 3:
    filePath = sys.argv[1]
    returnInteger = sys.argv[2]
    if not os.path.isfile(filePath):
        if returnInteger == "1": 
            print('0')
        else:
            print('Error occurred, failed to execute tests.')
    else:
        with open(filePath) as file:
            data = file.read()
            print(data)
else:
    print('Missing arguments.')