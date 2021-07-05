import fs from "fs";
import { resolve } from "path";
import { RequirementsReadWriteConfig } from "../../requirements/configRequirementsRun";
import { findLastGeneratedResultsJsonFolder } from "./helpers/findLastGeneratedResults";
import { findRequirementsListToProcess } from "./helpers/findRequirementsListToProcess";
import { MERGED_SPECS_JSON_CACHE_PATH, utf8Encoding } from "./helpers/typing.constants";

const REQUIREMENTS_LIST = findRequirementsListToProcess();
const pathToJsonFolder = findLastGeneratedResultsJsonFolder();

copyMergedJson(REQUIREMENTS_LIST);

function copyMergedJson(reqsList: RequirementsReadWriteConfig) {
  if (reqsList.extract) {
    const mergedFileContent = fs.readFileSync(resolve(__dirname, "../../../",
      `${pathToJsonFolder}/${reqsList.outputFolderName}/${reqsList.outputFileName}`)).toString();
    const mergedJson = JSON.parse(mergedFileContent);

    fs.writeFileSync(resolve(__dirname, "../../..", MERGED_SPECS_JSON_CACHE_PATH),
      JSON.stringify(mergedJson, null, 2), utf8Encoding);
  }
}
