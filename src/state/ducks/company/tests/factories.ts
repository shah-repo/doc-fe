import faker from 'faker';
import { DEFAULT_NAVIGATION_ITEMS } from '../constants';
import { Company, Employee } from '../types';

export const getCompany = (company: Partial<Company> = {}): Company => ({
  id: faker.random.uuid(),
  name: faker.company.companyName(),
  numOfRevStages: 1,
  startRevisionNumber: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: {},
  slackIntegrationEnabled: false,
  helloSignAppId: '',
  teamId: faker.random.uuid(),
  addresses: [],
  acctCodes: [],
  helloSignIntegrationEnabled: false,
  navigation: DEFAULT_NAVIGATION_ITEMS,
  scheduledForDeletion: false,
  ...company,
});

export const getEmployee = (employee: Partial<Employee> = {}): Employee => ({
  id: faker.random.uuid(),
  active: true,
  company: getCompany(),
  slackUserId: faker.random.uuid(),
  ...employee,
});
