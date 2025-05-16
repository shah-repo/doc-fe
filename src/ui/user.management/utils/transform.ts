import { omit } from 'lodash';
import { EmployeeActiveStatusRequestBody, EmployeeGroupsEditRequestBody } from '../../../state/ducks/userManagement/types';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { parseJSON, stringifyJSON } from '../../document.type.management/transform';

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
    omit(item, ['isOpen'])),
  );

  return ({
    navigation: stringifyJSON(navigationOmitedValues),
  });
};

export const toNavigationBodyValues = (values) => ({
  navigation: parseJSON(values.navigation),
});

export const objectValuesToString = <T extends Record<string, unknown>>(object: T): { [K in keyof T]: string } => {
  const result: Partial<{ [K in keyof T]: string }> = {};

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = String(object[key]);
    }
  }

  return result as { [K in keyof T]: string };
};

export const objectValuesToNumber = <T extends Record<string, unknown>>(
  object: T,
): { [K in keyof T]: number } => {
  const result: Partial<{ [K in keyof T]: number }> = {};

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = Number(object[key]);
    }
  }

  return result as { [K in keyof T]: number };
};

export const getObjectChangedValues = <T extends object>(
  original: T,
  updated: T,
): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in original) {
    if (Object.prototype.hasOwnProperty.call(original, key)) {
      if (original[key] !== updated[key]) {
        result[key] = updated[key];
      }
    }
  }

  return result;
};

// White labeling config helpers
export const toWhiteLabelingInitialValues = (whiteLabeling) => ({
  whiteLabeling: stringifyJSON(whiteLabeling),
});

export const toWhiteLabelingBodyValues = (values) => ({
  whiteLabeling: parseJSON(values.whiteLabeling),
});
