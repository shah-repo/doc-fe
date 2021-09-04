import { CI_BUILD_ID, GENERATED_INFO_JSON, RESULTS_FOLDER } from "./typing.constants";

export function findLastGeneratedResultsJsonFolder() {
  if (!CI_BUILD_ID) {
    throw new Error("Spec Reports folder not found!");
  }

  return `${RESULTS_FOLDER}/${CI_BUILD_ID}/json`;
}

export function findLastGeneratedResultsReportsFolder() {
  if (!CI_BUILD_ID) {
    throw new Error("Spec Reports folder not found");
  }

  return `${RESULTS_FOLDER}/${CI_BUILD_ID}/reports`;
}

export function findInfoGeneratedJsonFile() {
  if (!CI_BUILD_ID) {
    throw new Error("Spec Reports folder not found");
  }

  return `${RESULTS_FOLDER}/${CI_BUILD_ID}/json/${GENERATED_INFO_JSON}`;
}
