import faker from "faker";
import { Company, Employee, WhiteLabeling } from "../types";

export const getCompany = (company: Partial<Company> = {}): Company => ({
  id: faker.random.uuid(),
  name: faker.company.companyName(),
  maxRevisionStages: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: {} as WhiteLabeling,
  slackIntegrationEnabled: false,
  teamId: faker.random.uuid(),
  addresses: [],
  acctCodes: [],
  ...company,
});

export const getEmployee = (employee: Partial<Employee> = {}): Employee => ({
  id: faker.random.uuid(),
  active: true,
  company: getCompany(),
  slackUserId: faker.random.uuid(),
  ...employee,
});
