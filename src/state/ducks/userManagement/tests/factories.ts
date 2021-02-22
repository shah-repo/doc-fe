import faker from "faker";
import { LoadCompanyGroup } from "..";
import { Group } from "../../auth";
import { getCompany, getEmployee } from "../../company/tests/factories";

export const getGroup = (): Group => ({
  id: faker.random.uuid(),
  name: faker.random.word(),
  permissions: [],
  tags: null,
  joinedTags: null,
  joinedPermissions: [],
  parents: [],
  joinedParents: [],
  joinedEmployees: [],
});

export const getCompanyGroup = (): LoadCompanyGroup => ({
  ...getGroup(),
  defaultForNewUsers: true,
  company: getCompany(),
  employees: [getEmployee()],
  isOfficial: true,
  joinedParents: [],
});
