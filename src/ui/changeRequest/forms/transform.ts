import moment from "moment";
import {
  Approver,
  Assessment,
  ChangeRequest,
  ChangeRequestEditRequestBody,
  ImplementationPlan,
  Justifications,
} from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "./types";

type NestedObject = Justifications;

const createNestedObject = (value: NestedObject = { description: "", attachments: [] }) => ({
  description: value.description,
  attachments: value.attachments,
});

const createAssessment = (value: Assessment = {
  description: "",
  design: { reasoning: "", attachment: undefined },
  process: { reasoning: "", attachment: undefined },
  regulatory: { reasoning: "", attachment: undefined },
}) => ({
  description: value.description,
  design: value.design,
  process: value.process,
  regulatory: value.regulatory,
});

export const toChangeRequestFormValues = (changeRequest: ChangeRequest): ChangeRequestFormValues => {
  const values: ChangeRequestFormValues = {
    description: changeRequest.description,
    assessments: createAssessment(changeRequest.assessments),
    justifications: createNestedObject(changeRequest.justifications),
    implementationPlan: changeRequest.implementationPlan,
    approvals: changeRequest.approvals.map((approval) => ({
      label: approval.approver.name, value: approval.approver.email,
    })),
    effectiveDate: changeRequest.effectiveDate && moment.utc(changeRequest.effectiveDate).startOf("day").toDate(),
    documentRevisions: changeRequest.documentRevisions.map((documentRevision) => documentRevision.id ),
  };

  return values;
};

const createNestedObjectForRequestBody = (value: NestedObject) => ({
  description: value.description,
  attachments: value.attachments.map((attachment) => ({ id: attachment.id })),
});

const createAssessmentObjectForRequestBody = (value: Assessment) => ({
  description: value.description,
  design: value.design,
  process: value.process,
  regulatory: value.regulatory,
});

const toImplementationPlanEditRequestBody = (values: ImplementationPlan): ImplementationPlan => (
  {
    tasks: values.tasks,
    attachments: values.attachments,
  }
);

export const toChangeRequestEditRequestBody = (values: ChangeRequestFormValues): ChangeRequestEditRequestBody => {
  const changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    description: values.description,
    assessments: createAssessmentObjectForRequestBody(values.assessments),
    implementationPlan: toImplementationPlanEditRequestBody(values.implementationPlan),
    justifications: createNestedObjectForRequestBody(values.justifications),
    approvals: values.approvals.map((approver): Approver => ({ email: approver.value })),
    effectiveDate: values.effectiveDate && moment.utc(values.effectiveDate).startOf("day").toDate(),
    documentRevisions: values.documentRevisions.map((documentRevisionId) => ({ id: documentRevisionId })),
  };

  return changeRequestEditRequestBody;
};
