import faker from "faker";
import { Approval, ApprovalStatus, Document, DocumentEditRequestBody, DocumentStatus, User } from "../types";

export const getUser = (user: Partial<User> = {}): User => ({
  id: faker.random.uuid(),
  email: faker.internet.email(),
  ...user,
});

export const getDocument = (document: Partial<Document> = {}): Document => ({
  id: faker.random.uuid(),
  name: faker.lorem.sentence(),
  type: faker.lorem.word(),
  attachments: [],
  approvals: [],
  owner: getUser(),
  status: DocumentStatus.Draft,
  actions: [],
  docId: faker.random.alphaNumeric(),
  ...document,
});

export const getApproval = (approval: Partial<Approval> = {}): Approval => ({
  id: faker.random.uuid(),
  approver: getUser(),
  reviewedAt: undefined,
  status: ApprovalStatus.Approved,
  ...approval,
});

export const getDocumentEditRequestBody = (body: Partial<DocumentEditRequestBody> = {}): DocumentEditRequestBody => ({
  name: faker.lorem.sentence(),
  type: faker.lorem.word(),
  approversEmails: [],
  attachmentIds: [],
  ...body,
});
