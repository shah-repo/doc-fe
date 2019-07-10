import { ChangeRequestStatus } from "../../../state/ducks/changeRequest";
import { AssessmentType } from "../../../state/ducks/changeRequest";
import { SelectOption } from "../../components/forms/fields/Select";
import { Translation } from "../../translations/types";
import { ChangeRequestUserProps } from "./types";

export const canEditChangeRequest = ({changeRequest, currentUserEmail}: ChangeRequestUserProps) =>
  currentUserEmail === changeRequest.owner.email && changeRequest.state === ChangeRequestStatus.Draft;

export function assessmentParagraphTitle(type: AssessmentType): Translation {
  switch (type) {
    case AssessmentType.Design: return "change.request.design.assessment";
    case AssessmentType.Process: return "change.request.process.assessment";
    case AssessmentType.Regulatory: return "change.request.regulatory.assessment";
  }
}

export const changeRequestStatusOption = () => {
  const options: SelectOption[] = [];
  Object.keys(ChangeRequestStatus).map((key) => {
    // TODO: Change ChangeRequestStatus status into key = value, value = text
    const keyName = ChangeRequestStatus[key as keyof typeof ChangeRequestStatus];
    options.push({value: keyName, text: keyName});
  });
  return options;
};
