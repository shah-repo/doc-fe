
import { readdirSync, readFileSync, unlinkSync } from "fs";

export function deleteMochaTestReports(reportDir, testName) {
  const files: string[] = [];
  readdirSync(reportDir).forEach((file) => {
    if (file && file.includes("generated_specs")) {
      files.push(file);
    }
  });

  files.forEach((report) => {
    const rawdata = readFileSync(reportDir + report);
    const jsonReport = JSON.parse(rawdata.toString());
    if (jsonReport.results[0].file.includes(testName) && jsonReport.stats.failures === 1) {
      try {
        unlinkSync(reportDir + report);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  });
}

export function deleteJunitTestReports(reportDir, testName) {
  const files = readdirSync(reportDir);

  files.forEach((report) => {
    const rawdata = readFileSync(reportDir + report).toString();
    if (rawdata.includes(testName) && rawdata.includes("failures=\"1\"")) {
      try {
        unlinkSync(reportDir + report);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  });
}
