import { PENDING_ACTIONS_LIST } from "./constants";
import { ChangeRequest } from "../changeRequest";

export enum PendingActionType {
  PENDING_REVIEW = 'PENDING_REVIEW',
  PENDING_DOC_CONTROL = 'PENDING_DOC_CONTROL',
  PENDING_IMPL_PLAN_TASK = 'PENDING_IMPL_PLAN_TASK',
}

export interface PendingAction {
  type: PendingActionType;
  userId: string;
  changeReq: ChangeRequest;
}

export interface PendingActionsListAction {
  type: typeof PENDING_ACTIONS_LIST;
  payload: PendingAction[];
}

export type PendingActionsState = PendingAction[];