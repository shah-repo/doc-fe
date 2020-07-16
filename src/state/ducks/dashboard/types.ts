import { ChangeRequest } from "../changeRequest";
import { DocumentRevision } from "../documentRevisions";
import { TrainingRecord } from "../training";
import { PENDING_ACTIONS_LIST, PENDING_ACTIONS_REMOVE } from "./constants";

export enum PendingActionType {
  PENDING_REVIEW = "PENDING_REVIEW",
  PENDING_DOC_CONTROL = "PENDING_DOC_CONTROL",
  PENDING_TASK = "PENDING_TASK",
  PENDING_TRAINING_RECORDS = "PENDING_TRAINING_RECORDS",
  PURCHASE_ORDERS = "PURCHASE_ORDERS",
}

export interface PendingAction {
  type: PendingActionType;
  userId: string;
  changeReq?: ChangeRequest;
  trainingRecord?: TrainingRecord;
  documentRevision?: DocumentRevision;
}

export interface PendingActionsListAction {
  type: typeof PENDING_ACTIONS_LIST;
  payload: PendingAction[];
}

export interface PendingActionsRemoveAction {
  type: typeof PENDING_ACTIONS_REMOVE;
  payload: number;
}

export type PendingActionsState = PendingAction[];
