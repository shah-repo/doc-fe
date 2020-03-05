import sys
import json
from environs import Env

if len(sys.argv) >= 2:
	env = sys.argv[1]
	tempFile = 'aws/environments/constants.ts.template'
	configFile = 'src/common/constants.ts'
	jsonFile = 'aws/environments/%s.json' % env

	with open(jsonFile) as _jsonFile:
		jsonData = json.load(_jsonFile)		
		string = ''
		with open(tempFile) as _tempFile:
			string = _tempFile.read()
			for key in jsonData.keys():
				replace = '<%s>' % key
				string = string.replace(replace, jsonData[key])

		with open(configFile, 'w+') as _configFile:
			_configFile.write(string)
else:
    print('input error.')