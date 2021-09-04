import { RequirementsReadWriteConfig, REQUIREMENTS_CONFIG_RUN } from "../../../requirements/configRequirementsRun";

export function findRequirementsListToProcess() {
  const REQUIREMENTS_LISTS: RequirementsReadWriteConfig[] = [];

  if (REQUIREMENTS_CONFIG_RUN.extractGeneralCSV) {
    REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.generalRequirements);
  }
  else if (REQUIREMENTS_CONFIG_RUN.extractSpecificCSV) {
    REQUIREMENTS_LISTS.push(...REQUIREMENTS_CONFIG_RUN.specificRequirements);
  }

  const requirementsList = REQUIREMENTS_LISTS.find((x) => x.extract);
  if (requirementsList) {
    return requirementsList;
  } else {
    throw new Error("There is not csv to extract.");
  }
}
