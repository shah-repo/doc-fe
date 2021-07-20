interface ConfigRequirements {
  extractPerModules: boolean;
  extractPerSubModules: boolean;
  extractGeneralCSV: boolean;
  extractSpecificCSV: boolean;
  generalRequirements: RequirementsReadWriteConfig[];
  specificRequirements: RequirementsReadWriteConfig[];
}

export interface RequirementsReadWriteConfig {
  extract: boolean;
  sourcePath: string;
  outputPath: string;
  outputFolderName: string;
  outputFileName: string;
  extractModules?: boolean;
  extractSubModules?: boolean;
}

export const REQUIREMENTS_CONFIG_RUN: ConfigRequirements = {
  extractPerModules: true,
  extractPerSubModules: true,
  extractGeneralCSV: true,
  extractSpecificCSV: true,
  generalRequirements: [
    {
      extract: true,
      sourcePath: "generalCSV/list.csv",
      outputPath: "requirements/cache/general",
      outputFolderName: "general",
      outputFileName: "general.json",
      extractModules: true,
      extractSubModules: true,
    },
  ],
  specificRequirements: [
    {
      extract: true,
      sourcePath: "specificCSV/docControlReqs.csv",
      outputPath: "requirements/cache/specific/perCSV",
      outputFolderName: "docControlReqs",
      outputFileName: "docControlReqs.json",
      extractModules: true,
      extractSubModules: true,
    },
  ],
};
