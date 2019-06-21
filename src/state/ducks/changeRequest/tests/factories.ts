import faker from "faker";
import { ChangeRequest, ChangeRequestStatus, ChangeRequestEditRequestBody, ChangeRequestAvailableApprovers } from "../types";
import { getUser } from "../../common/tests/factories";

const createNestedObject = () => (
  {
    id: faker.random.uuid(),
    description: faker.lorem.sentence(),
    attachments: [],
  }
)

const createImplementationPlan = () => (
  {
    id: faker.random.uuid(),
    implementationPlanTasks: [],
    attachments: [],
  }
)

export const getChangeRequest = (changeRequest: Partial<ChangeRequest> = {}): ChangeRequest => ({
  id: faker.random.uuid(),
  state: ChangeRequestStatus.Draft,
  description: faker.lorem.sentence(),
  assessment: createNestedObject(),
  implementationPlan: createImplementationPlan(),
  justifications: createNestedObject(),
  effectiveDate: faker.date.future(undefined, '2019-05-31'),
  approvals: [],
  owner: getUser({ id: faker.random.uuid(), email: 'test@email.com' }),
  documentRevisions: [],
  ...changeRequest,
});

export const getChangeRequestEditRequestBody = (body: Partial<ChangeRequestEditRequestBody> = {}): ChangeRequestEditRequestBody => ({
  description: faker.lorem.sentence(),
  assessment: createNestedObject(),
  implementationPlan: createNestedObject(),
  justifications: createNestedObject(),
  effectiveDate: faker.date.future(undefined, '2019-05-31'),
  approvals: [],
  documentRevisions: [],
  ...body,
});

export const getApprover = (approver: Partial<ChangeRequestAvailableApprovers> = {}): ChangeRequestAvailableApprovers => ({
  id: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.firstName(),
  ...approver,
});