interface ConfigRequirements {
  extractPerModules: boolean;
  extractPerSubModules: boolean;
  extractGeneralCSV: boolean;
  extractSpecificCSV: boolean;
  generalRequirements: RequirementsReadWriteConfig[];
  specificRequirements: RequirementsReadWriteConfig[];
}

export interface RequirementsReadWriteConfig {
  sourcePath: string;
  outputPath: string;
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
      sourcePath: "generalCSV/list.csv",
      outputPath: "requirements/cache/general/general.json",
      extractModules: true,
      extractSubModules: true,
    },
  ],
  specificRequirements: [
    {
      sourcePath: "specificCSV/docControlReqs.csv",
      outputPath: "requirements/cache/specific/perCSV/docControlReqs.json",
      extractModules: true,
      extractSubModules: true,
    },
  ],
};
