
import { existsSync, readdirSync, readFileSync, unlinkSync } from "fs";
import { CONFIG } from "../config";

export function deleteMochaTestReports(specFileName: string) {
  const reportDir = `${CONFIG.JSON_REPORTS_FOLDER}/`;
  if (existsSync(reportDir)) {
    const files: string[] = [];
    readdirSync(reportDir).forEach((file) => {
      if (file && file.includes("generated_specs")) {
        files.push(file);
      }
    });

    files.forEach((report) => {
      const rawdata = readFileSync(reportDir + report);
      const jsonReport = JSON.parse(rawdata.toString());
      if (jsonReport.results[0].file.includes(specFileName) && jsonReport.stats.failures === 1) {
        try {
          unlinkSync(reportDir + report);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    });
  }
}

export function deleteJunitTestReports(specFileName) {
  const reportDir = `${CONFIG.JSON_REPORTS_FOLDER}/junit/`;
  if (existsSync(reportDir)) {
    const files = readdirSync(reportDir);

    files.forEach((report) => {
      const rawdata = readFileSync(reportDir + report).toString();
      if (rawdata.includes(specFileName) && rawdata.includes("failures=\"1\"")) {
        try {
          unlinkSync(reportDir + report);
        } catch (err) {
        // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    });
  }
}
