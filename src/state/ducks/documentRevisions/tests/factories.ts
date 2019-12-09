import faker from "faker";
import { Audit } from "../../audit/types";
import { getOwner } from "../../common/tests/factories";
import { DocumentType } from "../documentType";
import {
  Document,
  DocumentRevision,
  DocumentRevisionEditRequestBody,
  DocumentRevisionStatus,
  RevisionChangeType,
} from "../types";

export const generateDocumentType = (docType: Partial<DocumentType> = {}): DocumentType => {
  return {
    id: faker.random.uuid(),
    documentTypeAcronym: faker.random.word(),
    documentTypeName: faker.random.words(),
    group: "OTHER",
    ...docType,
  };
};

export const getDocumentRevision = (documentRevision: Partial<DocumentRevision> = {}): DocumentRevision => ({
  id: faker.random.uuid(),
  version: faker.random.number(10),
  revision: faker.random.number(10),
  revisionStage: faker.random.number(10),
  owner: getOwner(),
  status: DocumentRevisionStatus.Draft,
  attachments: [],
  name: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  document: {
    id: faker.random.uuid(),
    docId: faker.random.alphaNumeric(),
    referencedBy: [],
    documentType: {
      id: faker.random.uuid(),
      documentTypeAcronym: faker.random.word(),
      documentTypeName: faker.random.word(),
      group: "OTHER",
    },
  },
  released: faker.date.future(undefined, "2019-05-31"),
  referenceTo: [],
  trainingRecords: [],
  ...documentRevision,
});

export const getDocumentRevisionEditRequestBody = (
  body: Partial<DocumentRevisionEditRequestBody> = {},
): DocumentRevisionEditRequestBody => ({
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
  docId: faker.random.word(),
  documentRevisions: [getDocumentRevision()],
  documentType: generateDocumentType(),
  ...document,
});

export const getAudit = (audit: Partial<Audit> = {}): Audit => ({
  id: faker.random.uuid(),
  type: faker.lorem.word(),
  field: faker.lorem.word(),
  nextValue: faker.lorem.sentence(),
  groupId: "1",
  timestamp: faker.date.recent().toString(),
  owner: getOwner(),
  ownerUser: getOwner(),
  ownerThirdParty: getOwner(),
  ...audit,
});
