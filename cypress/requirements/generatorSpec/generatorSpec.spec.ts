// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />


// import fs from "fs";
import fs from "fs";
import { resolve } from "path";
import { findLastGeneratedReportsJsonFolder, selectRequirementsToProcess } from "../../support/organizeReports/organizeReports";
import { ImplementedBy } from "../../utils/context/implementedBy";
import { SYSTEM_REQUREMENT_TITLE } from "../../utils/context/systemRequirement";
import { RequirementsReadWriteConfig } from "../configRequirementsRun";
// dynamically created by scripts/cypress/utils/generate_requirements_json_file.sh
import requirementsJson from "./../../cache/generated.json";

type ModuleOrSubModule = "Module" | "Sub-Module";

interface CyReportSuite {
  suites: CyReportSuite[];
  tests: CyReportTest[];
}

interface CyReportTest {
  fullTitle: string;
  context: any[];
  pass: boolean;
  fail: boolean;
  skipped: boolean;
}

const REQUIREMENTS_LISTS = selectRequirementsToProcess();
const pathToJsonFolder = findLastGeneratedReportsJsonFolder();

REQUIREMENTS_LISTS.forEach((reqsList) => {
  allCSVRequirements(reqsList);
  csvModulesOrSubModulesRequirements(reqsList, "Module");
  csvModulesOrSubModulesRequirements(reqsList, "Sub-Module");
});

function allCSVRequirements(reqsList: RequirementsReadWriteConfig) {
  if (reqsList.extract) {
    const fileContent = fs.readFileSync(resolve(__dirname, "../../",
      `${pathToJsonFolder}/${reqsList.outputFolderName}/${reqsList.outputFileName}`)).toString();
    const json = JSON.parse(fileContent);
    generateHTMLReports(json);
  }
}

function csvModulesOrSubModulesRequirements(
  reqsList: RequirementsReadWriteConfig, modulesOrSubModules: ModuleOrSubModule) {
  if ((reqsList.extractModules && modulesOrSubModules === "Module") ||
  (reqsList.extractSubModules && modulesOrSubModules === "Sub-Module")) {

    const fileList = fs.readdirSync(resolve(__dirname, "../../",
      `${pathToJsonFolder}/${reqsList.outputFolderName}/${modulesOrSubModules}`));

    fileList.forEach((fileName) => {
      const fileContent = fs.readFileSync(resolve(__dirname, "../../",
        `${pathToJsonFolder}/${reqsList.outputFolderName}/${modulesOrSubModules}/${fileName}`)).toString();
      const json = JSON.parse(fileContent);
      generateHTMLReports(json);
    });
  }
}

function collectTests(suite: CyReportSuite) {
  const tests: CyReportTest[] = [];
  tests.push(...suite.tests);
  suite.suites.forEach((s) => {
    tests.push(...collectTests(s));
  });
  return tests;
}


function generateHTMLReports(mergedJson: any) {
  const tests: CyReportTest[] = [];
  mergedJson.results.forEach((suite) => {
    tests.push(...collectTests(suite as unknown as CyReportSuite));
  });

  tests.forEach((testCase) => {
    if (!testCase.context) {
      return;
    }
    testCase.context = JSON.parse(testCase.context as unknown as string);

    if (!Array.isArray(testCase.context)) {
      testCase.context = [testCase.context];
    }

    testCase.context.forEach((context) => {
      if (context.title !== SYSTEM_REQUREMENT_TITLE) {
        return;
      }

      (context.value.match(/REQ-[0-9]+/gm) || []).forEach((req) => {
        requirementsJson[req].testCases =
        requirementsJson[req].testCases || [];
        requirementsJson[req].testCases.push({
          fullTitle: testCase.fullTitle,
          passes: testCase.pass,
        });
      });
    });
  });
}

context("System Requirements", function() {
  Object.values(requirementsJson).forEach((requirement) => {
    const testCases = ((requirement as any).testCases || []);
    const hasPassingTest = !!testCases.find((x) => x.passes);
    const hasFailingTest = !!testCases.find((x) => !x.passes);
    const cyFnToUse = hasPassingTest || hasFailingTest ? it : it.skip;

    cyFnToUse(`${requirement["REQ #"]}: ${requirement.Requirement}`, () => {
      const testCasesList: string[] = testCases.map((testCase) => {
        const status = testCase.passes ? "Pass" : "Fail";

        return `[${status}] - ${testCase.fullTitle}`;
      });

      ImplementedBy(...testCasesList);
      expect(hasFailingTest, "Expect all test passing").to.eql(false);
    });

  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

