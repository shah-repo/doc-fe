import sys
import json


with open('./aws/result.json') as testResults:
    data = json.load(testResults)
    testSuitesStr = '%d/%d test suites passed. ' % (data['numPassedTestSuites'], data['numTotalTestSuites'])
    testStr = '%d/%d test passed.' % (data['numPassedTests'], data['numTotalTests'])
    success = 1
    if data['numFailedTestSuites'] > 0 or data['numFailedTests'] > 0:
       success = 0
    testResults.close() 

    result = '%d|%s|%s' % (success, testSuitesStr, testStr)

    with open('./aws/test_result.txt', 'w+') as fTestResults: 
    	fTestResults.write('%s%s' % (testSuitesStr, testStr))
    	fTestResults.close() 

    with open('./aws/test_result_status.txt', 'w+') as fTestResults: 
    	fTestResults.write('%d' % (success))
    	fTestResults.close() 

    print(result)