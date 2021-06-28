import csv from "csvtojson";
import fs from "fs";
import { resolve } from "path";
import { selectRequirementsToProcess } from "../support/organizeReports/organizeReports";
import { RequirementsReadWriteConfig, REQUIREMENTS_CONFIG_RUN } from "./configRequirementsRun";
type ModuleOrSubModule = "Module" | "Sub-Module";

const REQ_HEADER_TEXT = "REQ #";

const REQUIREMENTS_LISTS = selectRequirementsToProcess();
REQUIREMENTS_LISTS.forEach((reqsList) => {
  if (reqsList.extract) {
    generateJsonFromCSVList(reqsList);
  }
});


function generateJsonFromCSVList(reqsList: RequirementsReadWriteConfig) {
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
        resolve(__dirname, "..", `${reqsList.outputPath}/${reqsList.outputFileName}`),
        jsonObject, { encoding: "UTF-8" }
      );

      if (REQUIREMENTS_CONFIG_RUN.extractPerModules && reqsList.extractModules) {
        generateModulesOrSubModulesFromJson(
          JSON.parse(jsonObject),
          reqsList.outputPath,
          reqsList.outputFolderName,
          "Module");
      }

      if (REQUIREMENTS_CONFIG_RUN.extractPerSubModules && reqsList.extractSubModules) {
        generateModulesOrSubModulesFromJson(
          JSON.parse(jsonObject),
          reqsList.outputPath,
          reqsList.outputFolderName,
          "Sub-Module");
      }
      // eslint-disable-next-line no-console
      console.log("DONE!!!!!!", resolve(__dirname, "..", `${reqsList.outputPath}/${reqsList.outputFileName}`));
    });
}

function generateModulesOrSubModulesFromJson(
  object: any,
  outputPath: string,
  outputFolderName: string,
  modulesOrSubModules: ModuleOrSubModule,
) {

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
        resolve(__dirname, "..", `${outputPath}/${outputFolderName}`))) {
        fs.mkdirSync(resolve(__dirname, "..", `${outputPath}/${outputFolderName}`));
      }

      if (!fs.existsSync(
        resolve(__dirname, "..", `${outputPath}/${outputFolderName}/${modulesOrSubModules}`))) {
        fs.mkdirSync(resolve(__dirname, "..", `${outputPath}/${outputFolderName}/${modulesOrSubModules}`));
      }

      fs.writeFileSync(
        resolve(__dirname, "..",
          `${outputPath}/${outputFolderName}/${modulesOrSubModules}/${key.toLowerCase().replace(/[" "/]/g, "_")}.json`),
        JSON.stringify(filteredObjectRequirements, null, 2), { encoding: "UTF-8" }
      );
    });
  }
}

