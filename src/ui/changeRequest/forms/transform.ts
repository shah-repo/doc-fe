import * as _ from "lodash";
import { applyTimezoneToDate, getDateString } from "../../../common/utils/date";
import { Attachment } from "../../../state/ducks/attachments";
import {
  Approver,
  Assessment,
  AssessmentType,
  ChangeRequest,
  ChangeRequestEditRequestBody,
  ImplementationPlan,
  ImplementationPlanRequest,
  ImplementationPlanTaskRequest,
  Justifications,
} from "../../../state/ducks/changeRequest";
import { reactQuillEmptyString } from "../../components/forms/fields/validators";
import { ChangeRequestFormValues, ImplementationPlanFormValues, ImplementationPlanTaskFormValues } from "./types";

type NestedObject = Justifications;

const createNestedObject = (value: NestedObject = { description: "", attachments: [] }) => ({
  description: value.description,
  attachments: value.attachments,
});

const createAssessment = (value: Assessment = {
  design: {reasoning: null, attachments: null},
  process: {reasoning: null, attachments: null},
  regulatory: {reasoning: null, attachments: null},
}) => ({
  design: { reasoning: value.design.reasoning, attachments: value.design.attachments },
  process: { reasoning: value.process.reasoning, attachments: value.process.attachments },
  regulatory: { reasoning: value.regulatory.reasoning, attachments: value.regulatory.attachments },
});

const toImplementationPlanFormValues = (plan: ImplementationPlan): ImplementationPlanFormValues => {
  return (
    {
      attachments: plan.attachments,
      tasks: plan.tasks.map((task) => {
        const taskForm: ImplementationPlanTaskFormValues = {
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
          };
        }
        return taskForm;
      }),
    }
  );
};

export const toChangeRequestFormValues = (changeRequest: ChangeRequest): ChangeRequestFormValues => {
  const values: ChangeRequestFormValues = {
    id: changeRequest.id,
    title: changeRequest.title,
    assessments: createAssessment(changeRequest.assessments),
    justifications: createNestedObject(changeRequest.justifications),
    implementationPlan: toImplementationPlanFormValues(changeRequest.implementationPlan),
    approvals: changeRequest.approvals.map((approval) => ({
      label: approval.approver.name, value: approval.approver.email,
    })),
    effectiveDate: changeRequest.effectiveDate && applyTimezoneToDate(changeRequest.effectiveDate),
    documentRevisions: changeRequest.documentRevisions.map((documentRevision) => documentRevision.id ),
    description: changeRequest.description || reactQuillEmptyString,
  };

  return values;
};

const createNestedObjectForRequestBody = (value: NestedObject) => ({
  description: value.description,
  attachments: value.attachments.map((attachment) => ({ id: attachment.id })),
});

const toImplementationPlanEditRequestBody = (values: ImplementationPlanFormValues): ImplementationPlanRequest => {
  const valuesTasks: ImplementationPlanTaskRequest[] = values.tasks.map((t) => {
    const { assigned, dueDate, ...excluded } = t;
    const normalizedDueDate = getDateString(dueDate);
    if (assigned) {
      return ({ assigned: { id: assigned.value }, dueDate: normalizedDueDate, ...excluded });
    } else {
      return ({ dueDate: normalizedDueDate, ...excluded });
    }
  });
  return {
    tasks: valuesTasks,
    attachments: values.attachments.map((attachment) => ({ id: attachment.id })),
  };
};

const createAssessmentObjectForRequestBody = (value: Assessment) => {
  const assessments: any = createAssessment(value);

  Object.values(AssessmentType).map((t) => {
    const attachmentValue = _.get(value, `${t}.attachments`, null);
    const itemAttachment = (attachmentValue) ?
      attachmentValue.map((attachment: Attachment) => ({ id: attachment.id })) :
      [];
    const itemReasoning: string = _.get(value, `${t}.reasoning`, null);
    assessments[t] = { attachments: itemAttachment, reasoning: itemReasoning };
  });
  return assessments;
};

export const toChangeRequestEditRequestBody = (values: ChangeRequestFormValues): ChangeRequestEditRequestBody => {
  const changeRequestEditRequestBody: ChangeRequestEditRequestBody = {
    title: values.title,
    description: values.description,
    assessments: createAssessmentObjectForRequestBody(values.assessments),
    implementationPlan: toImplementationPlanEditRequestBody(values.implementationPlan),
    justifications: createNestedObjectForRequestBody(values.justifications),
    approvals: values.approvals.map((approver): Approver => ({ email: approver.value })),
    effectiveDate: values.effectiveDate && getDateString(values.effectiveDate),
    documentRevisions: values.documentRevisions.map((documentRevisionId) => ({ id: documentRevisionId })),
  };

  return changeRequestEditRequestBody;
};
