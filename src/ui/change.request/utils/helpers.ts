import {
  AssessmentType,
  ChangeRequestStatus,
  ImplementationPlanTask,
  ImplementationPlanTaskStatus,
} from "../../../state/ducks/changeRequest";
import { SelectOption } from "../../components/forms/fields/Select";
import { AssessmentReasoningOption, AssessmentReasoningOptionn, ChangeRequestUserProps } from "./types";

export const canEditChangeRequest = ({dataProp, currentUserEmail}: ChangeRequestUserProps) => (
  currentUserEmail === dataProp.owner.email && dataProp.state === ChangeRequestStatus.Draft
);

export const canEditApprovers = ({dataProp, currentUserEmail}: ChangeRequestUserProps) => {
  return canEditChangeRequest({dataProp, currentUserEmail}) ||
    (currentUserEmail === dataProp.owner.email && dataProp.state === ChangeRequestStatus.InReview);
};

export const canCloseTask = (
  changeRequestStatus: ChangeRequestStatus,
  task: ImplementationPlanTask,
  currentUserEmail: string,
) => {
  return (
    (task.assigned && task.assigned.email === currentUserEmail) &&
    (task.status === ImplementationPlanTaskStatus.Pending) &&
    (changeRequestStatus === ChangeRequestStatus.InReview || changeRequestStatus === ChangeRequestStatus.Implementation || changeRequestStatus === ChangeRequestStatus.Approved)
  );
};

export const changeRequestStatusOption = () => {
  const options: SelectOption[] = [];
  Object.keys(ChangeRequestStatus).map((key) => {
    // TODO: Change ChangeRequestStatus status into key = value, value = text
    const keyName = ChangeRequestStatus[key as keyof typeof ChangeRequestStatus];
    options.push({value: keyName, text: keyName});
  });
  return options;
};

export const assessmentStatementOption = (type: AssessmentType) => {
  const options: SelectOption[] = [];
  const typeOptions = AssessmentReasoningOptionn[type];
  Object.keys(typeOptions).map((key) => {
    // TODO: Change ChangeRequestStatus status into key = value, value = text
    const keyName = typeOptions[key as keyof typeof typeOptions];
    options.push({value: keyName, text: keyName});
  });
  return options;
};
