import * as _ from "lodash";
import moment from "moment";
import {
  Approver,
  Assessment,
  AssessmentType,
  ChangeRequest,
  ChangeRequestEditRequestBody,
  ImplementationPlan,
  ImplementationPlanTask,
  Justifications,
  ImplementationPlanTaskRequest,
  ImplementationPlanRequest,
} from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues, ImplementationPlanTaskForm, ImplementationPlanFormValues, ImplementationPlanTaskFormValues } from "./types";

type NestedObject = Justifications;

const createNestedObject = (value: NestedObject = { description: "", attachments: [] }) => ({
  description: value.description,
  attachments: value.attachments,
});

const createAssessment = (value: Assessment = {
  description: "",
  design: {reasoning: null, attachment: null},
  process: {reasoning: null, attachment: null},
  regulatory: {reasoning: null, attachment: null},
}) => ({
  description: value.description,
  design: value.design,
  process: value.process,
  regulatory: value.regulatory,
});

const toImplementationPlanFormValues = (plan: ImplementationPlan): ImplementationPlanFormValues => {
  return (
    {
      attachments: plan.attachments,
      tasks: plan.tasks.map((task) => {
        let taskForm: ImplementationPlanTaskFormValues = {
          id: task.id,
          status: task.status,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
        };

        if (task.assigned) {
          taskForm.assigned = {
            value: task.assigned.id,
            label: task.assigned.name,
          }
        }
        return taskForm;
      })
    }
  )
}

export const toChangeRequestFormValues = (changeRequest: ChangeRequest): ChangeRequestFormValues => {
  const values: ChangeRequestFormValues = {
    description: changeRequest.description,
    assessments: createAssessment(changeRequest.assessments),
    justifications: createNestedObject(changeRequest.justifications),
    implementationPlan: toImplementationPlanFormValues(changeRequest.implementationPlan),
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

const toImplementationPlanEditRequestBody = (values: ImplementationPlanFormValues): ImplementationPlanRequest => {
  const valuesTasks: ImplementationPlanTaskRequest[] = values.tasks.map((t) => {
    const { assigned, ...excluded } = t;
    if (assigned) {
      return ({ assigned: { id: assigned.value }, ...excluded });
    } else {
      return ({ ...excluded });
    }
  });
  return { tasks: valuesTasks, attachments: values.attachments };
};

const createAssessmentObjectForRequestBody = (value: Assessment) => {
  const assessments: any = createAssessment(value);

  Object.values(AssessmentType).map((t) => {
    const attachmentValue = _.get(value, `${t}.attachment`, null);
    const itemAttachment = (attachmentValue) ? { id: attachmentValue.id } : attachmentValue;
    const itemReasoning: string = _.get(value, `${t}.reasoning`, null);
    assessments[t] = { attachment: itemAttachment, reasoning: itemReasoning };
  });
  return assessments;
};

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
