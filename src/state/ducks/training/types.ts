import { Id } from "../common/types";
import { Employee } from "../company/types";
import {
  DocumentRevision,
  DocumentRevisionDocument,
} from "../documentRevisions/types";

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
  documentRevision: Partial<DocumentRevision>;
}

export enum TrainingStatusChartLabelTypes {
  OVERDUE = "OVERDUE",
  DUE_IN_7_DAYS = "DUE IN 7 DAYS",
  DUE = "DUE",
  TOTAL_OUTSTANDING = "Total Outstanding",
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
  tcId: string;
}

interface TrainingPlan {
  id: string;
  status: TrainingPlanStatus;
  validity: number;
  trainingRecords: TrainingRecord[];
  document: DocumentRevisionDocument;
  employee: Employee;
  curriculumDocIds: string[];
}

export interface TrainingTransitionRequestBody {
  password: string;
}

export interface TrainingRequestBody {
  docRev: Id;
}
