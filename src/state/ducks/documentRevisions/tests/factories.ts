import faker from "faker";
import { Audit } from "../../audit/types";
import { getUser } from "../../common/tests/factories";
import { Document, DocumentRevision, DocumentRevisionEditRequestBody, DocumentRevisionStatus, DocumentRevisionType, RevisionChangeType } from "../types";

export const getDocumentRevision = (documentRevision: Partial<DocumentRevision> = {}): DocumentRevision => ({
  id: faker.random.uuid(),
  version: faker.random.number(10),
  revision: faker.random.number(10),
  revisionStage: faker.random.number(10),
  owner: getUser(),
  status: DocumentRevisionStatus.Draft,
  attachments: [],
  name: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  document: { id: faker.random.uuid(), docId: faker.random.alphaNumeric(), type: faker.random.word(), referencedBy: [] },
  type: DocumentRevisionType.ADM,
  released: faker.date.future(undefined, "2019-05-31"),
  referenceTo: [],
  ...documentRevision,
});

export const getDocumentRevisionEditRequestBody = (body: Partial<DocumentRevisionEditRequestBody> = {}): DocumentRevisionEditRequestBody => ({
  name: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  attachments: [],
  type: faker.lorem.word(),
  referenceTo: [],
  revisionChangeType: RevisionChangeType.NextRevision,
  ...body,
});

export const getDocument = (document: Partial<Document> = {}): Document => ({
  id: faker.random.uuid(),
  ordinalNumber: faker.random.number(),
  documentRevisions: [getDocumentRevision()],
  ...document,
});

export const getAudit = (audit: Partial<Audit> = {}): Audit => ({
  type: faker.lorem.word(),
  field: faker.lorem.word(),
  nextValue: faker.lorem.sentence(),
  groupId: faker.random.uuid(),
  timestamp: faker.date.recent().toString(),
  owner: getUser(),
  ...audit,
});
