import faker from "faker";
import {
  PendingAction,
} from "../types";
import { getChangeRequest } from "../../changeRequest/tests/factories";

export const getPendingAction = (pendingAction: Partial<PendingAction> = {}): PendingAction => ({
  type: faker.random.word(),
  userId: faker.random.word(),
  changeReq: getChangeRequest(),
  ...pendingAction,
});

