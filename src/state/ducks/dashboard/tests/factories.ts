import faker from "faker";
import {
  PendingAction,
  PendingActionType,
} from "..";
import { getChangeRequest } from "../../changeRequest/tests/factories";

export const getPendingAction = (pendingAction: Partial<PendingAction> = {}): PendingAction => ({
  type: faker.random.arrayElement(Object.values(PendingActionType)),
  userId: faker.random.word(),
  changeReq: getChangeRequest(),
  ...pendingAction,
});
