import moment from 'moment';
import { ChangeRequestEditRequestBody, ChangeRequest, Assessment, Justifications, ImplementationPlan, Approver } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "./types";

type NestedObject = Assessment | Justifications | ImplementationPlan;

const createNestedObject = (value: NestedObject) => ({
  description: value['description'],
  attachments: value['attachments'],
})

export const toChangeRequestFormValues = (changeRequest: ChangeRequest): ChangeRequestFormValues => {
  const values: ChangeRequestFormValues = {
    description: changeRequest.description,
    assessment: createNestedObject(changeRequest.assessment),
    justifications: createNestedObject(changeRequest.justifications),
    implementationPlan: createNestedObject(changeRequest.implementationPlan),
    approvals: changeRequest.approvals.map((approval) => approval.approver.email),
    effectiveDate: changeRequest.effectiveDate && moment.utc(changeRequest.effectiveDate).startOf('day').toDate(),
    documentRevisions: changeRequest.documentRevisions,
  };

  return values;
};

export const toChangeRequestEditRequestBody = (values: ChangeRequestFormValues): ChangeRequestEditRequestBody => {
  const changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    description: values.description,
    assessment: values.assessment,
    implementationPlan: values.implementationPlan,
    justifications: values.justifications,
    approvals: values.approvals.map((approver): Approver => ({ email: approver.label })),
    effectiveDate: values.effectiveDate && moment.utc(values.effectiveDate).startOf('day').toDate(),
    documentRevisions: values.documentRevisions,
  };

  return changeRequestEditRequestBody;
};