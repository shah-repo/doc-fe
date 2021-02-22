import faker from "faker";
import { Company, DEFAULT_NAVIGATION_ITEMS, Employee, WhiteLabeling } from "..";

export const getCompany = (company: Partial<Company> = {}): Company => ({
  id: faker.random.uuid(),
  name: faker.company.companyName(),
  numOfRevStages: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: {} as WhiteLabeling,
  slackIntegrationEnabled: false,
  helloSignAppId: "",
  teamId: faker.random.uuid(),
  addresses: [],
  acctCodes: [],
  helloSignIntegrationEnabled: false,
  navigation: DEFAULT_NAVIGATION_ITEMS,
  ...company,
});

export const getEmployee = (employee: Partial<Employee> = {}): Employee => ({
  id: faker.random.uuid(),
  active: true,
  company: getCompany(),
  slackUserId: faker.random.uuid(),
  ...employee,
});
