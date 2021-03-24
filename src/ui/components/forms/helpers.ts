import { get, isEmpty, isEqual, omit } from "lodash";
import { toJS } from "mobx";

const clearMobxObject = (value) => typeof value === "object" ?
  toJS(value) :
  value;

const getDiff = (transformedValues, transformedInitialValues) => {
  const diff = {};
  for (const [key, value] of Object.entries(transformedValues)) {
    if (key === "formInput") {
      continue;
    }
    if (key === "formDocument") {
      if ((value as any)?.id !== transformedInitialValues.formDocument?.id) {
        diff[key] = value;
      }
      continue;
    }
    if (key === "formTemplate") {
      const initialFormTemplate = {
        outputDocumentTypes: (transformedInitialValues?.formTemplate?.outputDocumentTypes || [])
          .map((outputDoc) => ({ id: outputDoc.value }) ),
        schema: transformedInitialValues?.formTemplate?.schema,
      };
      const newFormTemplateValue = {
        outputDocumentTypes: (value as any).outputDocumentTypes,
        schema: toJS((value as any).schema),
      };
      if (!isEqual(initialFormTemplate, newFormTemplateValue)) {
        diff[key] = value;
      }
      continue;
    }
    if (!isEqual(value, transformedInitialValues[key])) {
      diff[key] = value;
    }
  }
  return diff;
};

const getFormInputDiff = (transformedValues, transformedInitialValues) => {
  const formInputDiff = {};
  for (const [key, value] of Object.entries(transformedValues.formInput || {})) {
    const initialValueToCompare = clearMobxObject(transformedInitialValues.formInput?.[key]);
    const valueToCompare = clearMobxObject(value);

    if (!isEqual(valueToCompare, initialValueToCompare)) {
      formInputDiff[key] = valueToCompare;
    }
  }
  return formInputDiff;
};

export const compareValuesToSubmit = (initialValues, values, transformMethod) => {
  const transformedInitialValues = transformMethod(initialValues);
  const transformedValues = transformMethod(values);
  let diff = getDiff(transformedValues, transformedInitialValues);
  const formInputDiff = getFormInputDiff(transformedValues, transformedInitialValues);
  // Added in case maintenance is created outside of EQ Maintenance
  const equipmentId = get(transformedValues, "formInput.equipment_id");
  if (!isEmpty(equipmentId)) {
    diff = {
      ...diff,
      parentEquipment: {
        id: equipmentId,
      },
    };
  }

  const hasKeysNotInValuesFormInput = transformedInitialValues?.formInput ?
    Object.keys(transformedInitialValues.formInput).some((k) => !(k in transformedValues.formInput)) :
    false;

  if (isEmpty(formInputDiff) && !hasKeysNotInValuesFormInput) {
    return diff;
  }

  return {
    ...diff,
    // TEMPORARY FIX FOR BE VALIDATION
    // formInput: transformedValues.formInput,
    formInput: omit(transformedInitialValues.formInput, ["partType", "childForRevise"]),
  };
};
