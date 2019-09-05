import sys
import json
import boto3
import os.path

path=sys.argv[1] #'./test-results/test.json'
if os.path.exists(path):
    with open(path, 'r+', encoding="utf-8") as handle:
        data = json.load(handle)
        if data['numFailedTestSuites'] >= 1 or data['numFailedTests'] >= 1 or data['numRuntimeErrorTestSuites'] >= 1:
            print('\n') 
            print('****************** Test Results ******************')
            print('\n') 
            for result in data['testResults']:
                if result['status'] == 'failed':
                    print('File: ' + result['name'])
                    print(result['message'])
                    print('\n')
            print('****************** Test Results ******************')
            print('\n') 