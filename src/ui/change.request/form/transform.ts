import { getStartOfDayDateString, toStartOfDay } from "../../../common/utils/date";
import { Approver, ChangeRequest, ChangeRequestEditRequestBody } from "../../../state/ducks/changeRequest";
import { reactQuillEmptyString } from "../../components/forms/fields/validators";
import { ChangeRequestFormValues } from "./types";

export interface OptionApproverType {
  value: string;
  label: string;
  groups: string[];
}

export const toChangeRequestFormValues = (changeRequest: ChangeRequest): ChangeRequestFormValues => {
  const values: ChangeRequestFormValues = {
    id: changeRequest.id,
    title: changeRequest.title,
    approvals: changeRequest.approvals.map((approval) => ({
      label: approval.approver.user.name, value: approval.approver.id,
    })),
    effectiveDate: changeRequest.effectiveDate && toStartOfDay(changeRequest.effectiveDate),
    documentRevisions: changeRequest.documentRevisions.map((documentRevision) => documentRevision.id ),
    description: changeRequest.description || reactQuillEmptyString,
  };

  return values;
};

export const toOptions = (values: any[]): OptionApproverType[] => values.map((value) => ({
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

export const toChangeRequestEditRequestBody = (values: ChangeRequestFormValues): ChangeRequestEditRequestBody => {
  const changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    title: values.title,
    description: values.description,
    approvals: (values.approvals || []).map((approver): Approver => ({ id: approver.value })),
    effectiveDate: values.effectiveDate && getStartOfDayDateString(values.effectiveDate),
    documentRevisions: values.documentRevisions.map((documentRevisionId) => ({ id: documentRevisionId })),
  };

  return changeRequestEditRequestBody;
};
