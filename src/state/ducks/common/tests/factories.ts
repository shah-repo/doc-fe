import faker from "faker";
import { Approval, ApprovalStatus, User } from "../types";

export const getUser = (user: Partial<User> = {}): User => ({
  id: faker.random.uuid(),
  email: faker.internet.email(),
  ...user,
});

export const getApproval = (approval: Partial<Approval> = {}): Approval => ({
  id: faker.random.uuid(),
  approver: getUser(),
  reviewedAt: undefined,
  status: ApprovalStatus.Approved,
  ...approval,
});