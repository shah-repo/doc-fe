
export enum TrainingStatusHeaders {
  Completed="Training Completed",
  Pending="Training Pending"
}

export enum TrainingStates {
  COMPLETED="Completed",
  PENDING="Pending"
}

export interface TrainingItem {
  name: string;
  email: string;
  state: string;
  avatar: string;
  initialColor: string;
  dueOn: Date;
  completedAt?: Date;
}

interface TrainingItemDataProps {
  data: TrainingItem[];
  title: string;
}

export interface GroupByStateProps {
  [key: string]: TrainingItemDataProps;
}

export interface FBTrainingInfoProps {
  trainingData?: GroupByStateProps;
  isLoading: boolean;
}
