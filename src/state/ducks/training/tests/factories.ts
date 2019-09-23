import faker from "faker";
import { TrainingRecord } from "../types";

export const getTrainingRecord = (trainingRecord: Partial<TrainingRecord> = {}): TrainingRecord => ({
  id: faker.random.uuid(),
  expireOn: faker.date.recent().toISOString(),
  dueOn: faker.date.recent().toISOString(),
  isRefreshed: false,
  isValid: false,
  ...trainingRecord,
});
