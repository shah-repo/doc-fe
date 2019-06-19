import sys
import json


if len(sys.argv) >= 2:
    directory = sys.argv[1]
    jsonFile = '%s/result.json' % directory
    resultFile1 = '%s/test_result.txt' % directory
    resultFile2 = '%s/test_result_status.txt' % directory
    
    with open(jsonFile) as testResults:
        data = json.load(testResults)
        testSuitesStr = '%d/%d test suites passed. ' % (data['numPassedTestSuites'], data['numTotalTestSuites'])
        testStr = '%d/%d test passed.' % (data['numPassedTests'], data['numTotalTests'])
        success = 1
        if data['numFailedTestSuites'] > 0 or data['numFailedTests'] > 0:
           success = 0
        testResults.close() 

        result = '%d|%s|%s' % (success, testSuitesStr, testStr)

        with open(resultFile1, 'w+') as fTestResults: 
        	fTestResults.write('%s%s' % (testSuitesStr, testStr))
        	fTestResults.close() 

        with open(resultFile2, 'w+') as fTestResults: 
        	fTestResults.write('%d' % (success))
        	fTestResults.close() 

        print(result)
else:
    print('input error.')