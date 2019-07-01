import { ChangeRequestStatus } from "../../../state/ducks/changeRequest";
import { AssessmentType } from "../../../state/ducks/changeRequest";
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
