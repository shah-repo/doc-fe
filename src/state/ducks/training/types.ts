import { User } from "../common";
import { DocumentRevisionDocument, DocumentRevision } from "../documentRevisions";
import { Employee } from "../company";

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
  documentRevision: DocumentRevision;
  trainingPlan: TrainingPlan;
  employee: Employee;
  createdAt:string;
  dueOn: string;
  completedAt?:string;
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
