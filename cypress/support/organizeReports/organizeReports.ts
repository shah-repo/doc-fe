import fs from "fs";
import { merge } from "mochawesome-merge";
import { resolve } from "path";
import { RequirementsReadWriteConfig } from "../../requirements/configRequirementsRun";
import { findGeneratedSpecFiles } from "./helpers/findGeneratedSpecFiles";
import { findLastGeneratedResultsJsonFolder } from "./helpers/findLastGeneratedResults";
import { findRequirementsListToProcess } from "./helpers/findRequirementsListToProcess";
import { FilesWithData, ModuleOrSubModule, utf8Encoding } from "./helpers/typing.constants";


const REQUIREMENTS_LIST = findRequirementsListToProcess();
const jsonFolderPath =  findLastGeneratedResultsJsonFolder();
const filesWithData = findGeneratedSpecFiles(jsonFolderPath);

processReportsSeparation(REQUIREMENTS_LIST, filesWithData, jsonFolderPath);

async function processReportsSeparation(
  reqsList: RequirementsReadWriteConfig,
  filesWithData: FilesWithData,
  jsonFolderPath: string) {

  await processCSVRequirementsJson(reqsList, filesWithData, jsonFolderPath);
  await processModuleOrSubModuleRequirementsJson(reqsList, filesWithData, "Module");
  await processModuleOrSubModuleRequirementsJson(reqsList, filesWithData, "Sub-Module");
}

async function processCSVRequirementsJson(
  reqsList: RequirementsReadWriteConfig, filesWithData: FilesWithData, jsonFolderPath: string) {
  const fileContent = fs.readFileSync(resolve(__dirname, "../../",
    `${reqsList.outputPath}/${reqsList.outputFileName}`)).toString();
  const filePaths = compareRequirementsAndSelectGeneratedSpecJsons(reqsList, fileContent, filesWithData);
  await generateReport(
    filePaths,
    `${jsonFolderPath}/${reqsList.outputFolderName}/${reqsList.outputFileName}`,
    `${jsonFolderPath}/${reqsList.outputFolderName}`,
    reqsList.outputFileName,
  );
}

async function processModuleOrSubModuleRequirementsJson(
  reqsList: RequirementsReadWriteConfig,
  filesWithData: FilesWithData,
  moduleOrSubModule: ModuleOrSubModule) {
  const filesList = fs.readdirSync(resolve(__dirname, "../../",
    `${reqsList.outputPath}/${reqsList.outputFolderName}/${moduleOrSubModule}`));

  await Promise.all(filesList.map((fileName) =>   {
    const fileContent = fs.readFileSync(resolve(__dirname, "../../",
      `${reqsList.outputPath}/${reqsList.outputFolderName}/${moduleOrSubModule}/${fileName}`)).toString();
    const filePaths = compareRequirementsAndSelectGeneratedSpecJsons(reqsList, fileContent, filesWithData);

    if (!fs.existsSync(
      resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}`))) {
      fs.mkdirSync(
        resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}`));
    }
    generateReport(
      filePaths,
      `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}/${fileName}`,
      `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}`,
      fileName);
  }));
}

function compareRequirementsAndSelectGeneratedSpecJsons(
  reqsList: RequirementsReadWriteConfig,
  fileContent: string,
  filesWithData: FilesWithData) {
  const usedRequirements = Object.keys(JSON.parse(fileContent));
  const filesSatisfiedRequirements = Object.keys(filesWithData).filter((fileName) =>
    ((filesWithData[fileName].reqsList || []).some((fileReq) => usedRequirements.includes(fileReq))));

  if (!filesSatisfiedRequirements.length) {
    return;
  }

  if (!fs.existsSync(
    resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}`))) {
    fs.mkdirSync(resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}`));
  }

  return filesSatisfiedRequirements.map((fileName) =>
    `./${jsonFolderPath}/${fileName}`);
}

async function generateReport(filesToJoin, output, outputFolderPath, fileName) {
  const options = { files: filesToJoin };
  const report = await merge(options);
  fs.writeFileSync(resolve(__dirname, "../../..", output), JSON.stringify(report, null, 2), utf8Encoding);
}
