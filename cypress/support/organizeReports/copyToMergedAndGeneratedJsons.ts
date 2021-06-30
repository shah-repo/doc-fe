import fs from "fs";
import { resolve } from "path";
import { RequirementsReadWriteConfig, REQUIREMENTS_CONFIG_RUN } from "../../requirements/configRequirementsRun";

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

const REQUIREMENTS_LISTS = selectRequirementsToProcess();
const pathToJsonFolder = findLastGeneratedReportsJsonFolder();
const REQUIREMENTS_LIST = REQUIREMENTS_LISTS.find((x) => x.extract);

if (REQUIREMENTS_LIST) {
  copyJsons(REQUIREMENTS_LIST);
} else {
  throw new Error("There is not csv to extract.");
}

function copyJsons(reqsList: RequirementsReadWriteConfig) {
  if (reqsList.extract) {
    const mergedFileContent = fs.readFileSync(resolve(__dirname, "../../../",
      `${pathToJsonFolder}/${reqsList.outputFolderName}/${reqsList.outputFileName}`)).toString();
    const mergedJson = JSON.parse(mergedFileContent);

    fs.writeFileSync(resolve(__dirname, "../../..", "cypress/cache/merged_specs.json"),
      JSON.stringify(mergedJson, null, 2), { encoding: "UTF-8" });


    const requirementsFileContent = fs.readFileSync(resolve(__dirname, "../../",
      `${reqsList.outputPath}/${reqsList.outputFileName}`)).toString();
    const requirementsJson = JSON.parse(requirementsFileContent);

    fs.writeFileSync(resolve(__dirname, "../../..", "cypress/cache/generated.json"),
      JSON.stringify(requirementsJson, null, 2), { encoding: "UTF-8" });
  }
}
