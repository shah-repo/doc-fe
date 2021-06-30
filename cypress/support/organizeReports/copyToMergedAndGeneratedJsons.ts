import fs from "fs";
import { resolve } from "path";
import { RequirementsReadWriteConfig } from "../../requirements/configRequirementsRun";
import { findLastGeneratedResultsJsonFolder } from "./helpers/findLastGeneratedResults";
import { findRequirementsListToProcess } from "./helpers/findRequirementsListToProcess";
import { fileWriteEncoding } from "./helpers/typing.constants";

const REQUIREMENTS_LIST = findRequirementsListToProcess();
const pathToJsonFolder = findLastGeneratedResultsJsonFolder();

copyJsons(REQUIREMENTS_LIST);

function copyJsons(reqsList: RequirementsReadWriteConfig) {
  if (reqsList.extract) {
    const mergedFileContent = fs.readFileSync(resolve(__dirname, "../../../",
      `${pathToJsonFolder}/${reqsList.outputFolderName}/${reqsList.outputFileName}`)).toString();
    const mergedJson = JSON.parse(mergedFileContent);

    fs.writeFileSync(resolve(__dirname, "../../..", "cypress/cache/merged_specs.json"),
      JSON.stringify(mergedJson, null, 2), fileWriteEncoding);


    const requirementsFileContent = fs.readFileSync(resolve(__dirname, "../../",
      `${reqsList.outputPath}/${reqsList.outputFileName}`)).toString();
    const requirementsJson = JSON.parse(requirementsFileContent);

    fs.writeFileSync(resolve(__dirname, "../../..", "cypress/cache/generated.json"),
      JSON.stringify(requirementsJson, null, 2), fileWriteEncoding);
  }
}
