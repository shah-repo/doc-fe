import { ChangeRequestStatus } from "../../../state/ducks/changeRequest";
import { ChangeRequestUserProps } from "./types";

export const canEditChangeRequest = ({changeRequest, currentUserEmail}: ChangeRequestUserProps) =>
  currentUserEmail === changeRequest.owner.email && changeRequest.state === ChangeRequestStatus.Draft;
