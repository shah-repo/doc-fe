import fs from "fs";
import { resolve } from "path";
import { RequirementsReadWriteConfig } from "../../requirements/configRequirementsRun";
import { findLastGeneratedResultsJsonFolder } from "./helpers/findLastGeneratedResults";
import { findRequirementsListToProcess } from "./helpers/findRequirementsListToProcess";
import { DEFAULT_MERGED_SPECS_JSON, MERGED_SPECS_JSON_CACHE_PATH, utf8Encoding } from "./helpers/typing.constants";

const REQUIREMENTS_LIST = findRequirementsListToProcess();
const pathToJsonFolder = findLastGeneratedResultsJsonFolder();

copyMergedJson(REQUIREMENTS_LIST);

function copyMergedJson(reqsList: RequirementsReadWriteConfig) {
  if (reqsList.extract) {
    const filePath = `${pathToJsonFolder}/${reqsList.outputFolderName}/${reqsList.outputFileName}`;
    let mergedFileContent: string;
    if (fs.existsSync((resolve(__dirname, "../../../", filePath)))) {
      mergedFileContent = fs.readFileSync(resolve(__dirname, "../../../", filePath)).toString();
    } else {
      mergedFileContent = fs.readFileSync(
        resolve(__dirname, "../../..", `${pathToJsonFolder}/${DEFAULT_MERGED_SPECS_JSON}`)).toString();
    }

    const    mergedJson = JSON.parse(mergedFileContent);
    fs.writeFileSync(resolve(__dirname, "../../..", MERGED_SPECS_JSON_CACHE_PATH),
      JSON.stringify(mergedJson, null, 2), utf8Encoding);
  }
}
