import faker from "faker";
import { getEmployee } from "../../company/tests/factories";
import { AuthResponse, User } from "../types";

export const getAuthResponse = (response: Partial<AuthResponse> = {}): AuthResponse => ({
  ExpiresAt: faker.date.recent().toISOString(),
  ExpiresIn: 3600,
  id: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  sessionId: faker.random.alphaNumeric(),
  employees: [getEmployee()],
  avatar: null,
  iotCredentials: {
    credentials: {
      AccessKeyId: faker.random.uuid(),
      SecretAccessKey: faker.random.uuid(),
      SessionToken: faker.random.uuid(),
      Expiration: faker.date.recent().toISOString(),
    },
    endpoint: faker.internet.url(),
    environment: "DEMO",
    companyId: faker.random.uuid(),
    region: "us-west-2",
  },
  ...response,
});

export const getUser = (): User => ({
  id: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  sessionId: faker.random.alphaNumeric(),
  employees: [getEmployee()],
  avatar: null,
  employeeId: faker.random.uuid(),
});
