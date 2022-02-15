import { Nullable } from "../../common/types";
import { TRAINING_LIST } from "./constants";

interface User {
  employeeId: string;
  userName: string;
}
export interface Training {
  pendingEmailSentAt: Nullable<string>;
  trainingStatus: string;
  docId: string;
  docDocumentId: string;
  docRevName: string;
  docRevVersion: string;
  trainingRecordId?: string | undefined;
  docRevId: string;
  id: string;
  type: string;
  timestamp: string;
  pinned: boolean;
  pendingTrainees?: User[] | undefined;
}
export interface TrainingListAction {
  type: typeof TRAINING_LIST;
  payload: Training[];
}

export type TrainingState = Training[];
