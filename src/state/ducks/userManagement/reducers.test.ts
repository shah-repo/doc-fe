import { CompanyGroupsListAction, COMPANY_GROUPS_LIST, LoadCompanyGroups } from ".";
import { groupsAllIds, groupsById } from "./reducers";
import { getCompanyGroup } from "./tests/factories";

describe("user management reducer test", () => {
  const companyGroups: LoadCompanyGroups = [
    getCompanyGroup(),
    getCompanyGroup(),
  ];
  const companyGroupsListAction: CompanyGroupsListAction = {
    type: COMPANY_GROUPS_LIST,
    payload: companyGroups,
  };

  describe("groupsAllIds", () => {
    const initialCompanyGroup = getCompanyGroup();
    const initialState = [initialCompanyGroup.id];
    const expectedState = [companyGroups[0].id, companyGroups[1].id];
    it("sets ids on COMPANY_GROUPS_LIST action", () => {
      expect(groupsAllIds(initialState, companyGroupsListAction)).toEqual(
        expectedState,
      );
    });
  });

  describe("groupsById", () => {
    const initialCompanyGroup = getCompanyGroup();
    const initialState = {
      [initialCompanyGroup.id]: initialCompanyGroup,
    };
    const expectedState = {
      [companyGroups[0].id]: companyGroups[0],
      [companyGroups[1].id]: companyGroups[1],
    };
    it("sets ids on COMPANY_GROUPS_LIST action", () => {
      expect(groupsById(initialState, companyGroupsListAction)).toEqual(
        expectedState,
      );
    });
  });
});
