import { ChangeRequest, ChangeRequestStatus } from "../../state/ducks/changeRequest";

export const canEditChangeRequest = (changeRequest: ChangeRequest, currentUserEmail: string) => (
  currentUserEmail === changeRequest.owner.email
  && (
    changeRequest.state === ChangeRequestStatus.Draft
    || changeRequest.state === ChangeRequestStatus.Withdrawn
    || changeRequest.state === ChangeRequestStatus.Rejected
  )
);
