import { TrainingRecord } from "../../../ui/training/types";
import { ChangeRequest } from "../changeRequest";
import { PENDING_ACTIONS_LIST } from "./constants";

export enum PendingActionType {
  PENDING_REVIEW = "PENDING_REVIEW",
  PENDING_DOC_CONTROL = "PENDING_DOC_CONTROL",
  PENDING_IMPL_PLAN_TASK = "PENDING_IMPL_PLAN_TASK",
  PENDING_TRAINING_RECORDS = "PENDING_TRAINING_RECORDS",
}

export interface PendingAction {
  type: PendingActionType;
  userId: string;
  changeReq: ChangeRequest;
  trainingRecord?: TrainingRecord;
}

export interface PendingActionsListAction {
  type: typeof PENDING_ACTIONS_LIST;
  payload: PendingAction[];
}

export type PendingActionsState = PendingAction[];
