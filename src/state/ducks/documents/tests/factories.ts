import faker from "faker";
import { Document, DocumentStatus } from "..";
import { getOwner } from "../../common/tests/factories";

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
