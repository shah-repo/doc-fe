import fs from "fs";
import { resolve } from "path";
import { FilesWithData } from "./typing.constants";

const REGEX_TO_FIND_REQS = /([R])([E])([Q])([-])([0-9]+)/g;

export function findGeneratedSpecFiles(jsonFolderPath) {
  const jsonFilesInLastFolder = fs.readdirSync((resolve(__dirname, "../../../..", jsonFolderPath)));
  const generatedSpecsFiles = jsonFilesInLastFolder.filter((file) => file.startsWith("generated_specs"));

  const filesWithData: FilesWithData  = {};
  generatedSpecsFiles.forEach((fileName) => {
    const fileContent = fs.readFileSync(resolve(__dirname, "../../../..", `${jsonFolderPath}/${fileName}`)).toString();
    Object.assign(filesWithData, {
      [fileName]: {
        fileContent: JSON.parse(fileContent),
        reqsList: fileContent.match(REGEX_TO_FIND_REQS),
      },
    });
  });

  return filesWithData;
}

export function findMainGeneratedRequirementsJsonFile(jsonFolderPath) {
  const fileContentGeneratedRequirements = fs.readFileSync(
    resolve(__dirname, "../../../..", `${jsonFolderPath}/generated_requirements.json`)).toString();
  const jsonGeneratedRequirements = JSON.parse(fileContentGeneratedRequirements);

  return jsonGeneratedRequirements;
}
