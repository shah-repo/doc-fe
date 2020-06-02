import _, { isEmpty } from "lodash";
import { toJS } from "mobx";
import React from "react";
import { AsyncStatus } from "../../../state/types";

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
      if (!_.isEqual(initialFormTemplate, newFormTemplateValue)) {
        diff[key] = value;
      }
      continue;
    }
    if (!_.isEqual(value, transformedInitialValues[key])) {
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

    if (!_.isEqual(valueToCompare, initialValueToCompare)) {
      formInputDiff[key] = valueToCompare;
    }
  }
  return formInputDiff;
};

export const compareValuesToSubmit = (initialValues, values, transformMethod) => {
  const transformedInitialValues = transformMethod(initialValues);
  const transformedValues = transformMethod(values);
  const diff = getDiff(transformedValues, transformedInitialValues);
  const formInputDiff = getFormInputDiff(transformedValues, transformedInitialValues);

  const hasKeysNotInValuesFormInput = transformedInitialValues?.formInput ?
    Object.keys(transformedInitialValues.formInput).some((k) => !(k in transformedValues.formInput)) :
    false;

  if (_.isEmpty(formInputDiff) && !hasKeysNotInValuesFormInput) {
    return diff;
  }

  return {
    ...diff,
    formInput: transformedValues.formInput,
  };
};

export const useFindDiff = () => {
  const [diffBeingSubmitted, setDiffBeingSubmitted] = React.useState({});
  const [diffToSubmit, setDiffToSubmit] = React.useState({});

  return React.useMemo(() => (
    initialValues,
    values,
    transformMethod,
    async
  ) => {
    // TODO: move to hook
    let dataToSubmit = compareValuesToSubmit(initialValues, values, transformMethod);

    if (async.asyncState.status === AsyncStatus.Active) {
      setDiffToSubmit(dataToSubmit);
      return [false];
    }

    dataToSubmit = {
      ...dataToSubmit,
      ...diffToSubmit,
    };

    const compare = (a, b) => {
      const diff = {};
      for (const [key, value] of Object.entries(a)) {
        if (!_.isEqual(value, b[key])) {
          diff[key] = value;
        }
      }
      return diff;
    };

    dataToSubmit = compare({ ...dataToSubmit }, diffBeingSubmitted);

    if (isEmpty(dataToSubmit)) {
      setDiffBeingSubmitted({});
      return [false];
    }
    setDiffToSubmit({});
    setDiffBeingSubmitted(dataToSubmit);
    return [true, dataToSubmit];
  }, [diffBeingSubmitted, diffToSubmit]);

};
