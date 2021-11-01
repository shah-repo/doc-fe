import { TRAINING_STATS_LIST } from "./constants";

export enum TrainingStatusTypes {
  OVERDUE = "OVERDUE",
  DUE = "DUE",
}

export interface User {
  createdAt: string;
  updatedAt: string;
  internalTags?: string;
  id: string;
  email: string;
  name: string;
  confirmed: string;
  locked: string;
  passwordExpires: string;
  passwordUpdatedAt: string;
  passwordLastEmailSentAt: string | null;
  permissions: string[] | null;
  avatar: string | null;
  initialColor: string;
}

export interface TrainingStats {
  user: User;
  status: TrainingStatusTypes;
  dueOn: string;
  docTitle: string;
  docId: string;
}

export interface TrainingStatsListAction {
  type: typeof TRAINING_STATS_LIST;
  payload: TrainingStats[];
}

export type TrainingStatsState = TrainingStats[];
