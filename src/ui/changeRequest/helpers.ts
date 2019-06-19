import { ChangeRequest, ChangeRequestStatus } from "../../state/ducks/changeRequest";

export const canEditChangeRequest = (changeRequest: ChangeRequest, currentUserEmail: string) =>
  currentUserEmail === changeRequest.owner.email && changeRequest.state === ChangeRequestStatus.Draft;


export const canSubmitChangeRequest = (changeRequest: ChangeRequest, currentUserEmail: string) =>
  currentUserEmail === changeRequest.owner.email && changeRequest.state === ChangeRequestStatus.Draft;

export const canWithdrawChangeRequest = (changeRequest: ChangeRequest, currentUserEmail: string) =>
  currentUserEmail === changeRequest.owner.email && changeRequest.state === ChangeRequestStatus.Submitted;
