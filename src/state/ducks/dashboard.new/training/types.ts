import { Nullable } from '../../common/types';
import { TRAINING_LIST } from './constants';

interface User {
  employeeId: string;
  userName: string;
}
interface Training {
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
  payload: TrainingListApiResponse;
  initialLoad?: boolean;
}
export interface TrainingListApiResponse {
  results: Training[];
  page_total: number;
  total: number;
}

export type TrainingState = TrainingListApiResponse;
