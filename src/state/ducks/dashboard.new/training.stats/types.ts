import { Nullable } from '../../common/types';
import { TRAINING_STATS_CHART, TRAINING_STATS_LIST } from './constants';

export enum TrainingStatusTypes {
  OVERDUE = 'OVERDUE',
  DUE = 'DUE',
}

export enum TrainingStatusChartLabelTypes {
  OVERDUE = 'Overdue',
  DUE = 'Due in 7 Days',
  TOTAL_OUTSTANDING = 'Total Outstanding',
}

interface User {
  createdAt: string
  updatedAt: string
  internalTags?: string
  id: string
  email: string
  name: string
  confirmed: string
  locked: string
  passwordExpires: string
  passwordUpdatedAt: string
  passwordLastEmailSentAt: Nullable<string>
  permissions: Nullable<string>
  avatar: Nullable<string>
  initialColor: string
}

export interface TrainingStatsListApiResponse {
  results: TrainingStats[]
  page_total: number
  total: number
}

interface TrainingStats {
  user: User
  id: string
  status: TrainingStatusTypes
  dueOn: string
  docTitle: string
  docId: string
}

export interface TrainingStatsListAction {
  type: typeof TRAINING_STATS_LIST
  payload: TrainingStatsListApiResponse
  initialLoad?: boolean
}

export type TrainingStatsState = TrainingStatsListApiResponse;

export interface TrainingStatsChart {
  DUE: number
  OVERDUE: number
}

export interface TrainingStatsChartAction {
  type: typeof TRAINING_STATS_CHART
  payload: TrainingStatsChart
}

export type TrainingStatsChartState = TrainingStatsChart;
