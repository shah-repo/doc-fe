import faker from "faker";
import { getOwner } from "../../common/tests/factories";
import { Document, DocumentStatus } from "../types";

export const getDocument = (document: Partial<Document> = {}): Document => ({
  id: faker.random.uuid(),
  name: faker.lorem.sentence(),
  type: faker.lorem.word(),
  attachments: [],
  approvals: [],
  owner: getOwner(),
  status: DocumentStatus.Draft,
  actions: [],
  docId: faker.random.alphaNumeric(),
  ...document,
});
