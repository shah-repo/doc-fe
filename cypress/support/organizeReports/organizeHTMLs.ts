/* eslint-disable no-console */
import fs from "fs";
import { cloneDeep } from "lodash";
import { merge } from "mochawesome-merge";
import marge from "mochawesome-report-generator";
import { resolve } from "path";
import { RequirementsReadWriteConfig } from "../../requirements/configRequirementsRun";
import { findMainGeneratedRequirementsJsonFile } from "./helpers/findGeneratedSpecFiles";
import { findLastGeneratedResultsJsonFolder, findLastGeneratedResultsReportsFolder } from "./helpers/findLastGeneratedResults";
import { findRequirementsListToProcess } from "./helpers/findRequirementsListToProcess";
import { ModuleOrSubModule, utf8Encoding } from "./helpers/typing.constants";

const REGEX_TO_FIND_REQS = /([R])([E])([Q])([-])([0-9]+)/g;
const REQUIREMENTS_LIST = findRequirementsListToProcess();
const jsonFolderPath =  findLastGeneratedResultsJsonFolder();
const jsonGeneratedRequirements = findMainGeneratedRequirementsJsonFile(jsonFolderPath);

processReportsSeparation(REQUIREMENTS_LIST, jsonFolderPath, jsonGeneratedRequirements);

async function processReportsSeparation(
  reqsList: RequirementsReadWriteConfig,
  jsonFolderPath: string,
  jsonGeneratedRequirements: any) {

  await processCSVRequirementsJson(reqsList, jsonFolderPath, jsonGeneratedRequirements);
  await processModuleOrSubModuleRequirementsJson(reqsList, "Module", jsonGeneratedRequirements);
  await processModuleOrSubModuleRequirementsJson(reqsList, "Sub-Module", jsonGeneratedRequirements);
}

async function processCSVRequirementsJson(
  reqsList: RequirementsReadWriteConfig,
  jsonFolderPath: string,
  jsonGeneratedRequirements: any) {
  const fileContent = fs.readFileSync(resolve(__dirname, "../../",
    `${reqsList.outputPath}/${reqsList.outputFileName}`)).toString();

  const filePaths = compareRequirementsAndSelectGeneratedSpecJsons(
    reqsList,
    fileContent,
    `${jsonFolderPath}/${reqsList.outputFolderName}/${reqsList.outputFileName}`,
    jsonGeneratedRequirements,
    `${jsonFolderPath}/${reqsList.outputFolderName}/generated_reqs_${reqsList.outputFileName}`,
    reqsList.outputFileName);

  await generateReport(
    filePaths,
    `${jsonFolderPath}/${reqsList.outputFolderName}/${reqsList.outputFileName}`,
    reqsList.outputFileName);
}

async function processModuleOrSubModuleRequirementsJson(
  reqsList: RequirementsReadWriteConfig,
  moduleOrSubModule: ModuleOrSubModule,
  jsonGeneratedRequirements: any) {
  const filesList = fs.readdirSync(resolve(__dirname, "../../",
    `${reqsList.outputPath}/${reqsList.outputFolderName}/${moduleOrSubModule}`));

  await Promise.all(filesList.map((fileName) =>   {
    const fileContent = fs.readFileSync(resolve(__dirname, "../../",
      `${reqsList.outputPath}/${reqsList.outputFolderName}/${moduleOrSubModule}/${fileName}`)).toString();
    const filePaths = compareRequirementsAndSelectGeneratedSpecJsons(
      reqsList,
      fileContent,
      `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}/${fileName}`,
      jsonGeneratedRequirements,
      `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}/generated_reqs_${fileName}`,
      fileName);

    if (!fs.existsSync(
      resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}`))) {
      fs.mkdirSync(
        resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}`));
    }
    generateReport(
      filePaths,
      `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}/${fileName}`,
      fileName,
      moduleOrSubModule);
  }));
}

function compareRequirementsAndSelectGeneratedSpecJsons(
  reqsList: RequirementsReadWriteConfig,
  fileContent: string,
  reportJsonPath: string,
  jsonGeneratedRequirements: any,
  pathToFile: string,
  fileName: string) {
  const usedRequirements = Object.keys(JSON.parse(fileContent));

  if (!fs.existsSync(resolve(__dirname, "../../..", reportJsonPath))) {
    console.log("File should exist. For some reason it does not!");
    return;
  }
  const pathToGeneratedRequirementsFile = connectRequirementsWithCypressGeneratedJson(
    usedRequirements,
    jsonGeneratedRequirements,
    pathToFile,
    fileName,
  );

  if (!fs.existsSync(
    resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}`))) {
    fs.mkdirSync(resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}`));
  }

  return [reportJsonPath].concat(pathToGeneratedRequirementsFile);
}

function connectRequirementsWithCypressGeneratedJson(
  usedRequirements: string[],
  jsonGeneratedRequirements: any,
  pathToFile: string,
  fileName: string,
) {
  const jsonGeneratedReqs = cloneDeep(jsonGeneratedRequirements);
  const jsonResults = (jsonGeneratedRequirements.results || [])
    .map((result) => result.suites
      .map((suite) => suite.tests
        .map((test) => {
          const titleReq = test.title.match(REGEX_TO_FIND_REQS)?.shift();
          if (!titleReq) {
            // eslint-disable-next-line array-callback-return
            return;
          }
          if (usedRequirements.includes(titleReq)) {
            return test;
          }
        })))
    .flat(3)
    .filter((it) => it);

  jsonGeneratedReqs.results[0].suites[0] = {
    ...jsonGeneratedReqs.results[0].suites[0],
    title: `${jsonGeneratedReqs.results[0].suites[0].title} - ${fileName.replace(".json", "")}`,
    tests: jsonResults,
    passes: jsonResults.filter((test) => test.pass).map((test) => test.uuid),
    pending: jsonResults.filter((test) => test.pending).map((test) => test.uuid),
    failures: jsonResults.filter((test) => test.fail).map((test) => test.uuid),
    skipped: jsonResults.filter((test) => test.skipped).map((test) => test.uuid),
  };

  fs.writeFileSync(resolve(__dirname, "../../..", pathToFile),
    JSON.stringify(jsonGeneratedReqs, null, 2), utf8Encoding);

  return pathToFile;
}

async function generateReport(
  filesToJoin: string[] | undefined,
  output: string,
  fileName: string,
  moduleOrSubModule?: ModuleOrSubModule) {
  if (filesToJoin && filesToJoin.length > 1) {
    const options = { files: filesToJoin };
    const report = await merge(options);

    let filePrefix = "";
    if (moduleOrSubModule === "Module") {
      filePrefix = "module_";
    }
    else if (moduleOrSubModule === "Sub-Module") {
      filePrefix = "submodule_";
    }

    await marge.create(report, {
      reportFilename: `${filePrefix}${fileName.replace("json", "html")}`,
      assetsDir: `${findLastGeneratedResultsReportsFolder()}/assets`,
      reportDir: `${findLastGeneratedResultsReportsFolder()}`,
      cdn: true,
      overwrite: true,
    });
  }
}
