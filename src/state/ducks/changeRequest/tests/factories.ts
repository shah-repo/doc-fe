import faker from "faker";
import { getUser } from "../../common/tests/factories";
import {
  Audit,
  ChangeRequest,
  ChangeRequestAvailableApprovers,
  ChangeRequestEditRequestBody,
  ChangeRequestStatus,
} from "../types";

const createNestedObject = () => (
  {
    id: faker.random.uuid(),
    description: faker.lorem.sentence(),
    attachments: [],
  }
);

const createAssessment = () => (
  {
    description: faker.lorem.sentence(),
    design: {
      reasoning: "",
      attachment: {
        id: faker.random.uuid(),
        name: faker.lorem.word(),
        type: faker.lorem.word(),
        s3link: faker.lorem.text(),
      },
    },
    process: {
      reasoning: "No Attachment",
    },
    regulatory: {
      reasoning: "No Attachment",
    },
  }
);

const createImplementationPlan = () => (
  {
    id: faker.random.uuid(),
    tasks: [],
    attachments: [],
  }
);

export const getChangeRequest = (changeRequest: Partial<ChangeRequest> = {}): ChangeRequest => ({
  id: faker.random.uuid(),
  crId: faker.random.alphaNumeric(),
  ordinalNumber: faker.random.number(),
  state: ChangeRequestStatus.Draft,
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  assessments: createAssessment(),
  implementationPlan: createImplementationPlan(),
  justifications: createNestedObject(),
  effectiveDate: faker.date.future(undefined, "2019-05-31"),
  approvals: [],
  owner: getUser({ id: faker.random.uuid(), email: "test@email.com" }),
  documentRevisions: [],
  ...changeRequest,
});

export const getChangeRequestEditRequestBody = (
  body: Partial<ChangeRequestEditRequestBody> = {},
): ChangeRequestEditRequestBody => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  assessments: createAssessment(),
  implementationPlan: createImplementationPlan(),
  justifications: createNestedObject(),
  effectiveDate: faker.date.future(undefined, "2019-05-31").toString(),
  approvals: [],
  documentRevisions: [],
  ...body,
});

export const getApprover = (
  approver: Partial<ChangeRequestAvailableApprovers> = {},
): ChangeRequestAvailableApprovers => ({
  id: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.firstName(),
  ...approver,
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
