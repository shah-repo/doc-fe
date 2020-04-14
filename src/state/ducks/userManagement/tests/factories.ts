import faker from "faker";
import { Group } from "../../auth/types";
import { getCompany, getEmployee } from "../../company/tests/factories";
import { LoadCompanyGroup } from "../types";

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
