import { ChangeRequestStatus } from "../../../state/ducks/changeRequest";
import { AssessmentType } from "../../../state/ducks/changeRequest";
import { SelectOption } from "../../components/forms/fields/Select";
import { Translation } from "../../translations/types";
import { ChangeRequestUserProps } from "./types";

export const canEditChangeRequest = ({dataProp, currentUserEmail}: ChangeRequestUserProps) =>
  currentUserEmail === dataProp.owner.email && dataProp.state === ChangeRequestStatus.Draft;

export const changeRequestStatusOption = () => {
  const options: SelectOption[] = [];
  Object.keys(ChangeRequestStatus).map((key) => {
    // TODO: Change ChangeRequestStatus status into key = value, value = text
    const keyName = ChangeRequestStatus[key as keyof typeof ChangeRequestStatus];
    options.push({value: keyName, text: keyName});
  });
  return options;
};
