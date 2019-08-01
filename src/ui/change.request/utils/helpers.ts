import { ChangeRequestStatus } from "../../../state/ducks/changeRequest";
import { SelectOption } from "../../components/forms/fields/Select";
import { AssessmentReasoningOption, ChangeRequestUserProps } from "./types";

export const canEditChangeRequest = ({dataProp, currentUserEmail}: ChangeRequestUserProps) => (
  currentUserEmail === dataProp.owner.email
  && (
    dataProp.state === ChangeRequestStatus.Draft
    || dataProp.state === ChangeRequestStatus.Withdrawn
    || dataProp.state === ChangeRequestStatus.Rejected
  )
);

export const canEditApprovers = ({dataProp, currentUserEmail}: ChangeRequestUserProps) => {
  return canEditChangeRequest({dataProp, currentUserEmail}) || dataProp.state === ChangeRequestStatus.InReview;
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

export const assessmentStatementOption = () => {
  const options: SelectOption[] = [];
  Object.keys(AssessmentReasoningOption).map((key) => {
    // TODO: Change ChangeRequestStatus status into key = value, value = text
    const keyName = AssessmentReasoningOption[key as keyof typeof AssessmentReasoningOption];
    options.push({value: keyName, text: keyName});
  });
  return options;
};
