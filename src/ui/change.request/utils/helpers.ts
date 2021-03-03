import { ChangeRequestStatus } from "../../../state/ducks/changeRequest/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { ChangeRequestUserProps } from "./types";

export const canEditChangeRequest = ({ dataProp, currentUserEmail }: ChangeRequestUserProps) => (
  currentUserEmail === dataProp.owner.user.email && dataProp.state === ChangeRequestStatus.Draft
);

export const canChangeCROwner = (
  state: ChangeRequestStatus,
  currentEmployeeId: string,
  ownerId: string,
  isCompanyAdmin: boolean,
  hasOwnerShipTag: boolean
) =>
  ((
    state === ChangeRequestStatus.Draft ||
    state === ChangeRequestStatus.InReview ||
    state === ChangeRequestStatus.Implementation ||
    state === ChangeRequestStatus.Approved
  )
  && currentEmployeeId === ownerId) ||
  isCompanyAdmin ||
  hasOwnerShipTag;

export const canEditApprovers = ({ dataProp, currentUserEmail }: ChangeRequestUserProps) => canEditChangeRequest({ dataProp, currentUserEmail }) ||
    (currentUserEmail === dataProp.owner.user.email && dataProp.state === ChangeRequestStatus.InReview);

export const changeRequestStatusOption = () => {
  const options: SelectOption[] = [];
  Object.keys(ChangeRequestStatus).forEach((key) => {
    // TODO: Change ChangeRequestStatus status into key = value, value = text
    const keyName = ChangeRequestStatus[key as keyof typeof ChangeRequestStatus];
    options.push({ value: keyName, text: keyName });
  });
  return options;
};

