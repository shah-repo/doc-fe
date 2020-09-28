import { User } from "../common";
import { DocumentRevisionDocument } from "../documentRevisions";

export enum TrainingPlanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum TrainingPlanTransition {
  Complete = "complete",
}

export interface TrainingRecord {
  id: string;
  completedAt?: string;
  expireOn: string;
  obsoletedOn?: string;
  dueOn: string;
  isRefreshed: boolean;
  isValid: boolean;
  trainingPlan?: TrainingPlan;
}

export interface TrainingRecordQuery{
  revision: number;
  docId: string;
  docRevTitle: string;
  userName: string;
  createdAtAfter: Date;
  dueOn: Date;
  completedAtAfter: Date;
}

export interface TrainingPlan {
  id: string;
  status: TrainingPlanStatus;
  validity: number;
  trainingRecords: TrainingRecord[];
  document: DocumentRevisionDocument;
  user: User;
}

export interface TrainingTransitionRequestBody {
  password: string;
}
