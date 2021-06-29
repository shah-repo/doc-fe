import fs from "fs";
import { merge } from "mochawesome-merge";
import marge from "mochawesome-report-generator";
import { resolve } from "path";
import { RequirementsReadWriteConfig, REQUIREMENTS_CONFIG_RUN } from "../../requirements/configRequirementsRun";

interface FilesWithData {
  [key: string]: {
    fileContent: object;
    reqsList: string[];
  };
}

type ModuleOrSubModule = "Module" | "Sub-Module";
// const REQ_HEADER_TEXT = "REQ #";
const REGEX_TO_FIND_REQS = /([R])([E])([Q])([-])([0-9]+)/g;

const REQUIREMENTS_LISTS = selectRequirementsToProcess();

const jsonFolderPath =  findLastGeneratedReportsJsonFolder();
const jsonFilesInLastFolder = fs.readdirSync((resolve(__dirname, "../../..", jsonFolderPath)));
const generatedSpecsFiles = jsonFilesInLastFolder.filter((file) => file.startsWith("generated_specs"));

const filesWithData: FilesWithData  = {};
generatedSpecsFiles.forEach((fileName) => {
  const fileContent = fs.readFileSync(resolve(__dirname, "../../..", `${jsonFolderPath}/${fileName}`)).toString();
  Object.assign(filesWithData, {
    [fileName]: {
      fileContent: JSON.parse(fileContent),
      reqsList: fileContent.match(REGEX_TO_FIND_REQS),
    },
  });
});

REQUIREMENTS_LISTS.forEach((reqsList) => {
  if (reqsList.extract) {
    processReportsSeparation(reqsList, filesWithData, jsonFolderPath);
  }
});

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
      fileName,
    );
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
  merge(options).then((report) => {
    fs.writeFileSync(resolve(__dirname, "../../..", output), JSON.stringify(report, null, 2), { encoding: "UTF-8" });
  });

  const report = await merge(options);
  fs.writeFileSync(resolve(__dirname, "../../..", output), JSON.stringify(report, null, 2), { encoding: "UTF-8" });

  await marge.create(report, {
    reportFilename: `${fileName.replace("json", "html")}`,
    assetsDir: `${outputFolderPath}/assets`,
    reportDir: `${outputFolderPath}`,
    cdn: true,
    overwrite: true,
  });
}


export function findLastGeneratedReportsJsonFolder() {
  const RESULTS_FOLDER = "results";
  const subFolders = fs.readdirSync(resolve(__dirname, "../../..", RESULTS_FOLDER));
  const lastFolder = subFolders.reduce((a, b) => new Date(a) > new Date(b) ? a : b);

  if (!lastFolder) {
    throw new Error("Spec Reports folder not found!");
  }

  return `${RESULTS_FOLDER}/${lastFolder}/json`;
}

export function selectRequirementsToProcess() {
  const REQUIREMENTS_LISTS: RequirementsReadWriteConfig[] = [];

  if (REQUIREMENTS_CONFIG_RUN.extractGeneralCSV) {
    REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.generalRequirements);
  }
  if (REQUIREMENTS_CONFIG_RUN.extractSpecificCSV) {
    REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.specificRequirements);
  }

  return REQUIREMENTS_LISTS;
}
