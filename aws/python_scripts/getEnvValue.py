import sys
import json

if len(sys.argv) >= 3:
    env = sys.argv[1]
    key = sys.argv[2]
    filename = './aws/environments/%s.env' % env
    with open(filename) as envVars:
        data = json.load(envVars)
        print(data[key])
        envVars.close()
else:
    print('input error.')