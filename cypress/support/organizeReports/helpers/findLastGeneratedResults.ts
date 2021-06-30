import fs from "fs";
import { resolve } from "path";

export function findLastGeneratedResultsJsonFolder() {
  const RESULTS_FOLDER = "results";
  const subFolders = fs.readdirSync(resolve(__dirname, "../../../..", RESULTS_FOLDER));
  const lastFolder = subFolders.reduce((a, b) => new Date(a) > new Date(b) ? a : b);

  if (!lastFolder) {
    throw new Error("Spec Reports folder not found!");
  }

  return `${RESULTS_FOLDER}/${lastFolder}/json`;
}
