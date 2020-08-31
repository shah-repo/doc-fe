import { cloneDeep } from "lodash";
import { ApplicationState } from "../../reducers";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getCompanyGroup } from "./tests/factories";
import { GroupsByIdState } from "./types";

describe("user management selectors test", () => {
  let state: ApplicationState;
  const companyGroups = [getCompanyGroup()];
  const groupsById: GroupsByIdState = {
    [companyGroups[0].id]: companyGroups[0],
  };
  const groupsAllIds = [
    companyGroups[0].id,
  ];

  beforeAll(() => {
    state = cloneDeep(initialStoreState);
    state.userManagement.groupsAllIds = groupsAllIds;
    state.userManagement.groupsById = groupsById;
  });

  it("getGroupsOptions", () => {
    const expectedGroupOptions = [{
      label: companyGroups[0].name,
      text: companyGroups[0].name,
      value: companyGroups[0].id,
      tags: companyGroups[0].tags,
      permissions: companyGroups[0].permissions,
      parents: companyGroups[0].parents,
      joinedParents: companyGroups[0].joinedParents,
      defaultForNewUsers: companyGroups[0].defaultForNewUsers,
      isOfficial: companyGroups[0].isOfficial,
    }];
    expect(selectors.getGroupsOptions(state)).toEqual(expectedGroupOptions);
  });
});
