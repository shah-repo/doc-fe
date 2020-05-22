import _ from "lodash";
import { toJS } from "mobx";

const clearMobxObject = (value) => typeof value === "object" ?
  toJS(value) :
  value;

export const compareValuesToSubmit = (initialValues, values, transformMethod) => {
  const transformedInitialValues = transformMethod(initialValues);
  const transformedValues = transformMethod(values);
  const diff = {};
  const formInputDiff = {};

  for (const [key, value] of Object.entries(transformedValues)) {
    if (key === "formDocument") {
      if ((value as any)?.id !== transformedInitialValues.formDocument?.id) {
        diff[key] = value;
      }
      continue;
    }
    if (!_.isEqual(value, transformedInitialValues[key])) {
      diff[key] = value;
    }
  }
  for (const [key, value] of Object.entries(transformedValues.formInput || {})) {
    const initialValueToCompare = clearMobxObject(initialValues.formInput?.[key]);
    const valueToCompare = clearMobxObject(value);

    if (!_.isEqual(valueToCompare, initialValueToCompare)) {
      formInputDiff[key] = valueToCompare;
    }
  }

  // if (_.isEmpty(formInputDiff)) {
  //   return diff;
  // }

  if (!transformedValues.formInput) {
    return diff;
  }

  return {
    ...diff,
    formInput: transformedValues.formInput,
  };
};
