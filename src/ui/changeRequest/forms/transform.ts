import moment from 'moment';
import { ChangeRequestEditRequestBody, ChangeRequest, Assessment, Justifications, ImplementationPlan, Approver } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "./types";

type NestedObject = Assessment | Justifications;

const createNestedObject = (value: NestedObject) => ({
  description: value.description,
  attachments: value.attachments,
})

const createImplementationPlan = (value: ImplementationPlan) => (
  {
    implementationPlanTasks: [],
    attachments: [],
  }
)

export const toChangeRequestFormValues = (changeRequest: ChangeRequest): ChangeRequestFormValues => {
  const values: ChangeRequestFormValues = {
    description: changeRequest.description,
    assessment: createNestedObject(changeRequest.assessment),
    justifications: createNestedObject(changeRequest.justifications),
    implementationPlan: createImplementationPlan(changeRequest.implementationPlan),
    approvals: changeRequest.approvals.map((approval) => ({ label: approval.approver.name, value: approval.approver.email })),
    effectiveDate: changeRequest.effectiveDate && moment.utc(changeRequest.effectiveDate).startOf('day').toDate(),
    documentRevisions: changeRequest.documentRevisions.map((documentRevision) => documentRevision.id ),
  };

  return values;
};

const createNestedObjectForRequestBody = (value: NestedObject) => ({
  description: value.description,
  attachments: value.attachments.map((attachment) => ({ id: attachment.id })),
})

export const toChangeRequestEditRequestBody = (values: ChangeRequestFormValues): ChangeRequestEditRequestBody => {
  const changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    description: values.description,
    assessment: createNestedObjectForRequestBody(values.assessment),
    implementationPlan: values.implementationPlan,
    justifications: createNestedObjectForRequestBody(values.justifications),
    approvals: values.approvals.map((approver): Approver => ({ email: approver.value })),
    effectiveDate: values.effectiveDate && moment.utc(values.effectiveDate).startOf('day').toDate(),
    documentRevisions: values.documentRevisions.map((documentRevisionId) => ({ id: documentRevisionId })),
  };

  return changeRequestEditRequestBody;
};