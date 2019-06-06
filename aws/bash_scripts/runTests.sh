yarn test --outputFile "/aws/result.json" --json --no-watch --reporters="jest-junit"
mkdir /aws/test-reports
cp junit.xml /aws/test-reports/junit.xml