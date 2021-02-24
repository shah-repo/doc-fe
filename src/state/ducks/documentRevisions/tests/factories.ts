import faker from "faker";
import { Audit } from "../../audit/types";
import { getOwner } from "../../common/tests/factories";
import { DocumentType } from "../documentType/types";
import { Document, DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from "../types";

const generateDocumentType = (docType: Partial<DocumentType> = {}): DocumentType => ({
  id: faker.random.uuid(),
  documentTypeAcronym: faker.random.word(),
  documentTypeName: faker.random.words(),
  group: "OTHER",
  isQms: false,
  defaultTraining: false,
  ...docType,
});

export const getDocumentRevision = (documentRevision: Partial<DocumentRevision> = {}): DocumentRevision => ({
  id: faker.random.uuid(),
  precalc: {
    formDocId: faker.random.uuid(),
    revision: faker.random.number(10),
  },
  version: faker.random.number(10),
  revision: faker.random.number(10),
  revisionStage: faker.random.number(10),
  revisionChangeType: RevisionChangeType.NextRevision,
  owner: getOwner(),
  displayStatus: DocumentRevisionStatus.Draft,
  status: DocumentRevisionStatus.Draft,
  displayRevision: faker.random.number(10) as unknown as string,
  attachments: [],
  name: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  document: {
    id: faker.random.uuid(),
    docId: faker.random.alphaNumeric(),
    referencedBy: [],
    children: [],
    parent: {} as DocumentRevision,
    documentType: {
      id: faker.random.uuid(),
      documentTypeAcronym: faker.random.word(),
      documentTypeName: faker.random.word(),
      group: "OTHER",
    },
    securityList: {
      securityEmployees: [
        {
          id: faker.random.uuid(),
          email: faker.random.word(),
          name: faker.random.word(),
        },
      ],
      operators: [
        {
          id: faker.random.uuid(),
          email: faker.random.word(),
          name: faker.random.word(),
        },
      ],
      securityGroups: [
        {
          id: faker.random.uuid(),
          name: faker.random.word(),
          tags: [],
          permissions: [],
          joinedTags: [],
          joinedPermissions: [],
          parents: [],
          joinedParents: [],
          joinedEmployees: [],
        },
      ],
    },
    canAccess: true,
  },
  released: faker.date.future(undefined, "2019-05-31"),
  referenceTo: [],
  trainingRecords: [],
  ...documentRevision,
  inputOwners: [],
});

export const getDocument = (document: Partial<Document> = {}): Document => ({
  id: faker.random.uuid(),
  docId: faker.random.word(),
  documentRevisions: [getDocumentRevision()],
  documentType: generateDocumentType(),
  securityList: {
    securityEmployees: [
      {
        id: faker.random.uuid(),
        email: faker.random.word(),
        name: faker.random.word(),
      },
    ],
    operators: [
      {
        id: faker.random.uuid(),
        email: faker.random.word(),
        name: faker.random.word(),
      },
    ],
    securityGroups: [
      {
        id: faker.random.uuid(),
        name: faker.random.word(),
        tags: [],
        permissions: [],
        joinedTags: [],
        joinedPermissions: [],
        parents: [],
        joinedParents: [],
        joinedEmployees: [],
      },
    ],
  },
  ...document,
});

export const getAudit = (audit: Partial<Audit> = {}): Audit => ({
  id: faker.random.uuid(),
  type: "ARRAY_DELETED",
  field: faker.lorem.word(),
  nextValue: faker.lorem.sentence(),
  groupId: "1",
  timestamp: faker.date.recent().toString(),
  owner: getOwner(),
  ownerUser: getOwner(),
  ownerThirdParty: getOwner(),
  ...audit,
});
