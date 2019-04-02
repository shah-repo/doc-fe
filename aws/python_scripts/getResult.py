import sys
import json
import os.path

if len(sys.argv) >= 4:
    filePath = sys.argv[1]
    testsExecuted = sys.argv[2]
    returnInteger = sys.argv[3]
    if not os.path.isfile(filePath):
        if testsExecuted == "1":
            if returnInteger == "1": 
                print('0')
            else:
                print('Error occurred, failed to execute tests.')
        else:
            if returnInteger == "1": 
                print('0')
            else:
                print('No tests were executed.')
    else:
        with open(filePath) as file:
            data = file.read()
            print(data)
else:
    if returnInteger == "1": 
        print('0')
    else:
        print('Missing arguments.')