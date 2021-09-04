import fs from "fs";
import { resolve } from "path";
import { RequirementsReadWriteConfig } from "../../requirements/configRequirementsRun";
import { findRequirementsListToProcess } from "./helpers/findRequirementsListToProcess";
import { GENERATED_JSON_CACHE_PATH, utf8Encoding } from "./helpers/typing.constants";

const REQUIREMENTS_LIST = findRequirementsListToProcess();

copyGeneratedJson(REQUIREMENTS_LIST);

function copyGeneratedJson(reqsList: RequirementsReadWriteConfig) {
  if (reqsList.extract) {
    const requirementsFileContent = fs.readFileSync(resolve(__dirname, "../../",
      `${reqsList.outputPath}/${reqsList.outputFileName}`)).toString();
    const requirementsJson = JSON.parse(requirementsFileContent);

    fs.writeFileSync(resolve(__dirname, "../../..", GENERATED_JSON_CACHE_PATH),
      JSON.stringify(requirementsJson, null, 2), utf8Encoding);
  }
}
