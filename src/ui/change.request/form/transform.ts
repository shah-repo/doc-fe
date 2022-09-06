import { isEmpty, pick } from "lodash";
import { getStartOfDayDateString } from "../../../common/utils/date";
import { ChangeRequest, ChangeRequestEditRequestBody } from "../../../state/ducks/changeRequest/types";
import { ChangeRequestFormValues, TemplateOption } from "./types";

interface OptionApproverType {
  value: string;
  label: string;
  groups: string[];
}

export const toChangeRequestFormValues = (changeRequest: ChangeRequest): ChangeRequestFormValues => {
  const values: ChangeRequestFormValues = {
    id: changeRequest.id,
    title: changeRequest.title,
    description: changeRequest.description,
    formInput: changeRequest.formInput,
    formDocument: changeRequest.formDocument,
  };
  return values;
};

const toOptions = (values: any[]): OptionApproverType[] => values.map((value) => ({
  label: value.name,
  value: value.id,
  groups: [value.group],
}));

export const toUniqGroupOptions = (approvers) => {
  const arrayHashmap = toOptions(approvers).reduce((obj, item) => {
    obj[item.value] ? obj[item.value].groups.push(...item.groups) : (obj[item.value] = { ...item });
    return obj;
  }, {});

  const mergedArray = Object.values(arrayHashmap);

  return mergedArray;
};

export const templateOptionToChangeRequestCreateBody = (option: TemplateOption): ChangeRequestEditRequestBody => {
  const changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    formDocument: {
      id: option.value,
    },
    title: "",
    description: "",
    formInput: option.formInput ?? {},
    documentType: {
      id: option.docTypeId,
    },
  };

  return changeRequestEditRequestBody;
};

export const toChangeRequestEditRequestBody = (values: ChangeRequestFormValues): ChangeRequestEditRequestBody => {
  let changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    ...pick(values, ["formDocument"]),
    title: values.title,
    description: values.description,
    formInput: {
      ...values.formInput,
      effectiveDate: isEmpty(values.formInput?.effectiveDate)
        ? undefined
        : getStartOfDayDateString(values.formInput?.effectiveDate),
    },
  };
  if (!values.id) {
    changeRequestEditRequestBody = { ...changeRequestEditRequestBody, documentType: values.documentType };
  }
  return changeRequestEditRequestBody;
};


export const toChangeRequestUpdateRequestBody = (values: ChangeRequestFormValues): ChangeRequestEditRequestBody => {
  let changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    title: values.title,
    description: values.description,
    formInput: {
      ...values.formInput,
      effectiveDate: isEmpty(values.formInput?.effectiveDate)
        ? undefined
        : getStartOfDayDateString(values.formInput?.effectiveDate),
    },
  };
  if (!values.id) {
    changeRequestEditRequestBody = { ...changeRequestEditRequestBody, documentType: values.documentType };
  }
  return changeRequestEditRequestBody;
};
