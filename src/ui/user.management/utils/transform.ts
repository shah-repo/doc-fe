import { omit } from "lodash";
import { EmployeeActiveStatusRequestBody, EmployeeGroupsEditRequestBody } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { parseJSON, stringifyJSON } from "../../document.type.management/transform";

export const toEmployeeGroupsEditRequestBody = (employeeGroups: OptionType[] | null):
EmployeeGroupsEditRequestBody => {
  if (employeeGroups == null) { return { groups: [] }; }

  const employeeGroupsEditRequestBody: EmployeeGroupsEditRequestBody = {
    groups: employeeGroups.map((group) => ({
      id: group.value,
    })),
  };
  return employeeGroupsEditRequestBody;
};

export const toEmployeeActiveStatusEditRequestBody = (active: boolean): EmployeeActiveStatusRequestBody => ({
  active,
});

// Navigation config helpers
export const toNavigationIntialValues = (navigationItems) => {
  // We omit "isOpen" value because that is an internal flag
  // for menus in navigation
  const navigationOmitedValues = navigationItems.map((item) => (
    omit(item, ["isOpen"]))
  );

  return ({
    navigation: stringifyJSON(navigationOmitedValues),
  });
};

export const toNavigationBodyValues = (values) => ({
  navigation: parseJSON(values.navigation),
});

// Revision Stage config helpers
export const toNumRevisionStageInitialValues = (numOfRevStages) => ({
  numOfRevStages: numOfRevStages.toString(),
});

export const toNumRevisionStageBodyValues = (values) => ({
  numOfRevStages: Number(values.numOfRevStages),
});

// White labeling config helpers
export const toWhiteLabelingInitialValues = (whiteLabeling) => ({
  whiteLabeling: stringifyJSON(whiteLabeling),
});

export const toWhiteLabelingBodyValues = (values) => ({
  whiteLabeling: parseJSON(values.whiteLabeling),
});
