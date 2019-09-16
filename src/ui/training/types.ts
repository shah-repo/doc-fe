export interface TrainingRouteParams {
  trainingId: string;
}

// TODO: create training component in ducks, move there to types
export interface TrainingRecord {
  id: string;
  completedAt: string;
  expireOn: string;
  obsoletedOn: string;
  dueOn: string;
}
