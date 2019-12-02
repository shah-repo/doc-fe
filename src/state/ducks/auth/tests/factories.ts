import faker from "faker";
import { getEmployee } from "../../company/tests/factories";
import { AuthResponse } from "../types";

export const getAuthResponse = (response: Partial<AuthResponse> = {}): AuthResponse => ({
  ExpiresAt: faker.date.recent().toISOString(),
  ExpiresIn: 3600,
  id: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  sessionId: faker.random.alphaNumeric(),
  employees: [getEmployee()],
  ...response,
});
