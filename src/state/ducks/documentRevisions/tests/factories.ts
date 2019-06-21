import faker from "faker";
import { getUser } from "../../common/tests/factories";
import { DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus } from "../types";

export const getDocumentRevision = (documentRevision: Partial<DocumentRevision> = {}): DocumentRevision => ({
  id: faker.random.uuid(),
  version: faker.random.number(10),
  revision: faker.lorem.word(),
  owner: getUser(),
  status: DocumentRevisionStatus.Draft,
  attachments: [],
  name: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  document: { id: faker.random.uuid(), typeCount: faker.random.number(10) },
  type: faker.lorem.word(),
  ...documentRevision,
});

export const getDocumentRevisionEditRequestBody = (body: Partial<DocumentRevisionEditRequestBody> = {}): DocumentRevisionEditRequestBody => ({
  name: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  attachments: [],
  type: faker.lorem.word(),
  ...body,
});
