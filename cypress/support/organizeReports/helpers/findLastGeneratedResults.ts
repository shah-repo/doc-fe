import { CI_BUILD_ID, RESULTS_FOLDER } from "./typing.constants";

export function findLastGeneratedResultsJsonFolder() {
  if (!CI_BUILD_ID) {
    throw new Error("Spec Reports folder not found!");
  }

  return `${RESULTS_FOLDER}/${CI_BUILD_ID}/json`;
}
