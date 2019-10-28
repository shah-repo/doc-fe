import faker from "faker";
import { getChangeRequest } from "../../changeRequest/tests/factories";
import {
  PendingAction,
  PendingActionType,
} from "../types";

export const getPendingAction = (pendingAction: Partial<PendingAction> = {}): PendingAction => ({
  type: faker.random.arrayElement(Object.values(PendingActionType)),
  userId: faker.random.word(),
  changeReq: getChangeRequest(),
  ...pendingAction,
});
