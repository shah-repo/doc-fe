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

const fileContentGeneratedRequirements = fs.readFileSync(
  resolve(__dirname, "../../..", `${jsonFolderPath}/generated_requirements.json`)).toString();
const jsonGeneratedRequirements = JSON.parse(fileContentGeneratedRequirements);

REQUIREMENTS_LISTS.forEach((reqsList) => {
  if (reqsList.extract) {
    processReportsSeparation(reqsList, filesWithData, jsonFolderPath, jsonGeneratedRequirements);
  }
});

async function processReportsSeparation(
  reqsList: RequirementsReadWriteConfig,
  filesWithData: FilesWithData,
  jsonFolderPath: string,
  jsonGeneratedRequirements: any) {

  await processCSVRequirementsJson(reqsList, filesWithData, jsonFolderPath, jsonGeneratedRequirements);
  await processModuleOrSubModuleRequirementsJson(reqsList, filesWithData, "Module", jsonGeneratedRequirements);
  await processModuleOrSubModuleRequirementsJson(reqsList, filesWithData, "Sub-Module", jsonGeneratedRequirements);
}

async function processCSVRequirementsJson(
  reqsList: RequirementsReadWriteConfig,
  filesWithData: FilesWithData,
  jsonFolderPath: string,
  jsonGeneratedRequirements: any) {
  const fileContent = fs.readFileSync(resolve(__dirname, "../../",
    `${reqsList.outputPath}/${reqsList.outputFileName}`)).toString();

  const filePaths = compareRequirementsAndSelectGeneratedSpecJsons(
    reqsList,
    fileContent,
    filesWithData,
    jsonGeneratedRequirements,
    `${jsonFolderPath}/${reqsList.outputFolderName}/generated_reqs_${reqsList.outputFileName}`);

  await generateReport(
    filePaths,
    `${jsonFolderPath}/${reqsList.outputFolderName}/${reqsList.outputFileName}`,
    `${jsonFolderPath}/${reqsList.outputFolderName}`,
    reqsList.outputFileName);
}

async function processModuleOrSubModuleRequirementsJson(
  reqsList: RequirementsReadWriteConfig,
  filesWithData: FilesWithData,
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
      filesWithData,
      jsonGeneratedRequirements,
      `${jsonFolderPath}/${reqsList.outputFolderName}/${moduleOrSubModule}/generated_reqs_${fileName}`);

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
  filesWithData: FilesWithData,
  jsonGeneratedRequirements: any,
  pathToFile: string) {
  const usedRequirements = Object.keys(JSON.parse(fileContent));
  const filesSatisfiedRequirements = Object.keys(filesWithData).filter((fileName) =>
    ((filesWithData[fileName].reqsList || []).some((fileReq) => usedRequirements.includes(fileReq))));

  if (!filesSatisfiedRequirements.length) {
    return;
  }

  const pathToGeneratedRequirementsFile = connectRequirementsWithCypressGeneratedJson(
    usedRequirements,
    jsonGeneratedRequirements,
    pathToFile,
  );

  if (!fs.existsSync(
    resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}`))) {
    fs.mkdirSync(resolve(__dirname, "../../..", `${jsonFolderPath}/${reqsList.outputFolderName}`));
  }

  return filesSatisfiedRequirements.map((fileName) =>
    `./${jsonFolderPath}/${fileName}`).concat(pathToGeneratedRequirementsFile);
}

function connectRequirementsWithCypressGeneratedJson(
  usedRequirements: string[],
  jsonGeneratedRequirements: any,
  pathToFile: string,
) {

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

  jsonGeneratedRequirements.results[0].suites[0].tests = jsonResults;

  fs.writeFileSync(resolve(__dirname, "../../..", pathToFile),
    JSON.stringify(jsonGeneratedRequirements, null, 2), { encoding: "UTF-8" });

  return pathToFile;
}

async function generateReport(
  filesToJoin: string[] | undefined,
  output: string,
  outputFolderPath: string,
  fileName: string) {
  if (filesToJoin && filesToJoin.length > 1) {
    const options = { files: filesToJoin };
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
}


function findLastGeneratedReportsJsonFolder() {
  const RESULTS_FOLDER = "results";
  const subFolders = fs.readdirSync(resolve(__dirname, "../../..", RESULTS_FOLDER));
  const lastFolder = subFolders.reduce((a, b) => new Date(a) > new Date(b) ? a : b);

  if (!lastFolder) {
    throw new Error("Spec Reports folder not found!");
  }

  return `${RESULTS_FOLDER}/${lastFolder}/json`;
}

function selectRequirementsToProcess() {
  const REQUIREMENTS_LISTS: RequirementsReadWriteConfig[] = [];

  if (REQUIREMENTS_CONFIG_RUN.extractGeneralCSV) {
    REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.generalRequirements);
  }
  if (REQUIREMENTS_CONFIG_RUN.extractSpecificCSV) {
    REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.specificRequirements);
  }

  return REQUIREMENTS_LISTS;
}
