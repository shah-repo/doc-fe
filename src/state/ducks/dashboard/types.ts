import { PENDING_ACTIONS_LIST } from "./constants";
import { ChangeRequest } from "../changeRequest";

export interface PendingAction {
  type: string;
  userId: string;
  changeReq: ChangeRequest;
}

export interface PendingActionsListAction {
  type: typeof PENDING_ACTIONS_LIST;
  payload: PendingAction[];
}

export type PendingActionsState = PendingAction[];