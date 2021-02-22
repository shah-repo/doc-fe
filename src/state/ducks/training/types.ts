import { Employee } from "../company";
import { DocumentRevision, DocumentRevisionDocument } from "../documentRevisions";

enum TrainingPlanStatus {
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

export interface TrainingListData {
  documentRevision: DocumentRevision;
  trainingPlan: TrainingPlan;
  createdAt: Date;
  dueOn: Date;
  completedAt: Date;
}

export interface TrainingRecordQuery {
  isValid: boolean;
  revision: number;
  docId: string;
  docRevTitle: string;
  userName: string;
  createdAtAfter: Date;
  dueOn: Date;
  completedAtAfter: Date;
}

interface TrainingPlan {
  id: string;
  status: TrainingPlanStatus;
  validity: number;
  trainingRecords: TrainingRecord[];
  document: DocumentRevisionDocument;
  employee: Employee;
}

export interface TrainingTransitionRequestBody {
  password: string;
}
