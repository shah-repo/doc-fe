// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />


// import fs from "fs";
import fs from "fs";
import { resolve } from "path";
import { findLastGeneratedReportsJsonFolder, selectRequirementsToProcess } from "../../support/organizeReports/organizeReports";
import { ImplementedBy } from "../../utils/context/implementedBy";
import { SYSTEM_REQUREMENT_TITLE } from "../../utils/context/systemRequirement";
import { RequirementsReadWriteConfig } from "../configRequirementsRun";

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
const jsonRequirements: any[] = [];

REQUIREMENTS_LISTS.forEach((reqsList) => {
  jsonRequirements.push(allCSVRequirements(reqsList));
  jsonRequirements.push(...csvModulesOrSubModulesRequirements(reqsList, "Module"));
  jsonRequirements.push(...csvModulesOrSubModulesRequirements(reqsList, "Sub-Module"));
});

function allCSVRequirements(reqsList: RequirementsReadWriteConfig) {
  if (reqsList.extract) {
    const mergedFileContent = fs.readFileSync(resolve(__dirname, "../../../",
      `${pathToJsonFolder}/${reqsList.outputFolderName}/${reqsList.outputFileName}`)).toString();
    const mergedJson = JSON.parse(mergedFileContent);

    const requirementsFileContent = fs.readFileSync(resolve(__dirname, "../../",
      `${reqsList.outputPath}/${reqsList.outputFileName}`)).toString();
    const requirementsJson = JSON.parse(requirementsFileContent);

    return addRequirementsToReports(mergedJson, requirementsJson, reqsList.outputFileName);
  }
}

function csvModulesOrSubModulesRequirements(
  reqsList: RequirementsReadWriteConfig, modulesOrSubModules: ModuleOrSubModule) {
  const requirementsJsonModulesSubModules: any[] = [];
  if ((reqsList.extractModules && modulesOrSubModules === "Module") ||
  (reqsList.extractSubModules && modulesOrSubModules === "Sub-Module")) {

    const fileList = fs.readdirSync(resolve(__dirname, "../../../",
      `${pathToJsonFolder}/${reqsList.outputFolderName}/${modulesOrSubModules}`));

    const onlyJsonFiles = fileList.filter((fileName) => fileName.endsWith(".json"));

    onlyJsonFiles.forEach((fileName) => {
      const fileContent = fs.readFileSync(resolve(__dirname, "../../../",
        `${pathToJsonFolder}/${reqsList.outputFolderName}/${modulesOrSubModules}/${fileName}`)).toString();
      const json = JSON.parse(fileContent);

      const requirementsFileContent = fs.readFileSync(resolve(__dirname, "../../",
        // eslint-disable-next-line max-len
        `${reqsList.outputPath}/${reqsList.outputFolderName}/${modulesOrSubModules}/${fileName}`)).toString();
      const requirementsJson = JSON.parse(requirementsFileContent);

      requirementsJsonModulesSubModules.push(addRequirementsToReports(json, requirementsJson, fileName));
    });
  }
  return requirementsJsonModulesSubModules;
}

function collectTests(suite: CyReportSuite) {
  const tests: CyReportTest[] = [];
  tests.push(...suite.tests);
  suite.suites.forEach((s) => {
    tests.push(...collectTests(s));
  });
  return tests;
}


function addRequirementsToReports(mergedJson: any, requirementsJson: any, fileName: string) {
  const tests: CyReportTest[] = [];
  mergedJson.results.forEach((suite) => {
    tests.push(...collectTests(suite as unknown as CyReportSuite));
  });

  if (!tests) {
    console.log({ fileNameNoTests: fileName });
    return;
  }
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
        if (!requirementsJson[req]) {
          return;
        }
        requirementsJson[req].testCases =
        requirementsJson[req]?.testCases || [];
        requirementsJson[req].testCases.push({
          fullTitle: testCase.fullTitle,
          passes: testCase.pass,
        });
      });
    });
  });

  return requirementsJson;
}

context("System Requirements", function() {
  jsonRequirements.forEach((requirementsJson) => {
    Object.values(requirementsJson).forEach((requirement) => {
      const testCases = ((requirement as any).testCases || []);
      const hasPassingTest = !!testCases.find((x) => x.passes);
      const hasFailingTest = !!testCases.find((x) => !x.passes);
      const cyFnToUse = hasPassingTest || hasFailingTest ? it : it.skip;

      cyFnToUse(`${(requirement as any)["REQ #"]}: ${(requirement as any).Requirement}`, () => {
        const testCasesList: string[] = testCases.map((testCase) => {
          const status = testCase.passes ? "Pass" : "Fail";

          return `[${status}] - ${testCase.fullTitle}`;
        });

        ImplementedBy(...testCasesList);
        expect(hasFailingTest, "Expect all test passing").to.eql(false);
      });

    });
  });
});

// for TS error "All files must be modules when the '--isolatedModules' flag is provided" uncomment line below
export { };

