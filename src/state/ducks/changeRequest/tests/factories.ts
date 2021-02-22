import faker from "faker";
import { ChangeRequest, ChangeRequestAvailableApprovers, ChangeRequestStatus } from "..";
import { Audit } from "../../audit";
import { getOwner, getUser } from "../../common/tests/factories";

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
  createdAt: "2019-05-31",
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
  owner: getOwner(),
  documentRevisions: [],
  closedAt: faker.date.future(undefined, "2019-05-31"),
  ...changeRequest,
});

export const getApprover = (
  approver: Partial<ChangeRequestAvailableApprovers> = {},
): ChangeRequestAvailableApprovers => ({
  id: faker.random.uuid(),
  user: getUser(),
  ...approver,
});

export const getAudit = (audit: Partial<Audit> = {}): Audit => ({
  id: faker.random.uuid(),
  type: "ARRAY_NEW",
  field: faker.lorem.word(),
  nextValue: faker.lorem.sentence(),
  groupId: "1",
  timestamp: faker.date.recent().toString(),
  owner: getOwner(),
  ...audit,
});
