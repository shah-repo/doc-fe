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
