import csv from "csvtojson";
import fs from "fs";
import { resolve } from "path";
import { RequirementsReadWriteConfig, REQUIREMENTS_CONFIG_RUN } from "./configRequirementsRun";
type ModuleOrSubModule = "Module" | "Sub-Module";

const REQ_HEADER_TEXT = "REQ #";
const REQUIREMENTS_LISTS: RequirementsReadWriteConfig[] = [];

if (REQUIREMENTS_CONFIG_RUN.extractGeneralCSV) {
  REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.generalRequirements);
}

if (REQUIREMENTS_CONFIG_RUN.extractSpecificCSV) {
  REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.specificRequirements);
}

REQUIREMENTS_LISTS.forEach((reqsList) => {
  generateJsonFromCSVList(reqsList);
});


function generateJsonFromCSVList(reqsList) {
  csv()
    .fromFile([__dirname, reqsList.sourcePath].join("/"))
    .then((jsonObj) => {
      const result = {};
      jsonObj.forEach((item) => {
        if (result[item[REQ_HEADER_TEXT]]) {
          throw new Error("Found duplicate: " + item[REQ_HEADER_TEXT]);
        }
        result[item[REQ_HEADER_TEXT]] = item;
      });
      const jsonObject = JSON.stringify(result, null, 2);

      fs.writeFileSync(
        resolve(__dirname, "..", reqsList.outputPath),
        jsonObject, { encoding: "UTF-8" }
      );

      if (REQUIREMENTS_CONFIG_RUN.extractPerModules && reqsList.extractModules) {
        generateModulesOrSubModulesFromJson(
          JSON.parse(jsonObject), reqsList.outputPath, "Module");
      }

      if (REQUIREMENTS_CONFIG_RUN.extractPerSubModules && reqsList.extractSubModules) {
        generateModulesOrSubModulesFromJson(
          JSON.parse(jsonObject), reqsList.outputPath, "Sub-Module");
      }
      // eslint-disable-next-line no-console
      console.log("DONE!!!!!!", resolve(__dirname, "..", reqsList.outputPath));
    });
}

function generateModulesOrSubModulesFromJson(
  object: any,
  outputPath: string,
  modulesOrSubModules: ModuleOrSubModule,
) {
  const pathToFolder = (outputPath.split("/").slice(0, -1).join("/"));
  const folderName = (outputPath.split("/").pop())?.split(".").shift();

  const objectKeys = Object.keys(object);
  const groupedObjectsByModules = objectKeys
    .map((item) => object[item])
    .reduce((groups, item) => ({
      ...groups,
      [item[`${modulesOrSubModules}`]]: [...(groups[item[`${modulesOrSubModules}`]] || []), item],
    }), {});

  const moduleKeys = Object.keys(groupedObjectsByModules);
  if (moduleKeys.length) {
    moduleKeys.forEach((key) => {
      const selectedReqs = groupedObjectsByModules[key].map((item) => item["REQ #"]);
      const filteredObjectRequirements = objectKeys
        .filter((key) => selectedReqs.includes(key))
        .reduce((obj, key) => {
          obj[key] = object[key];
          return obj;
        }, {});


      if (!fs.existsSync(
        resolve(__dirname, "..", `${pathToFolder}/${folderName}`))) {
        fs.mkdirSync(resolve(__dirname, "..", `${pathToFolder}/${folderName}`));
      }

      if (!fs.existsSync(
        resolve(__dirname, "..", `${pathToFolder}/${folderName}/${modulesOrSubModules}`))) {
        fs.mkdirSync(resolve(__dirname, "..", `${pathToFolder}/${folderName}/${modulesOrSubModules}`));
      }

      fs.writeFileSync(
        resolve(__dirname, "..",
          `${pathToFolder}/${folderName}/${modulesOrSubModules}/${key.toLowerCase().replace(/[" "/]/g, "_")}.json`),
        JSON.stringify(filteredObjectRequirements, null, 2), { encoding: "UTF-8" }
      );
    });
  }
}

