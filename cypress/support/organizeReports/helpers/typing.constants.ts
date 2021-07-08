export type ModuleOrSubModule = "Module" | "Sub-Module";
export const REQ_HEADER_TEXT = "REQ #";
export const utf8Encoding = { encoding: "UTF-8" };
export const GENERATED_SPECS_PREFIX = "generated_specs";
export const GENERATED_REQUIREMENTS_JSON = "generated_requirements.json";
export const GENERATED_INFO_JSON = "generated_info.json";
export const RESULTS_FOLDER = "results";
export const CI_BUILD_ID = process.env.CI_BUILD_ID;
export const MERGED_SPECS_JSON_CACHE_PATH = "cypress/cache/merged_specs.json";
export const GENERATED_JSON_CACHE_PATH = "cypress/cache/generated.json";

export interface FilesWithData {
  [key: string]: {
    fileContent: object;
    reqsList: string[];
  };
}
