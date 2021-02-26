import { cloneDeep } from "lodash";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import { getEmployee } from "../company/tests/factories";
import { getGroup } from "../userManagement/tests/factories";
import selectors from "./selectors";
import { getUser } from "./tests/factories";
import { Permission } from "./types";

describe("auth selectors tests", () => {
  let state: ApplicationState;
  const user = getUser();
  const groups = [getGroup()];
  const employee = getEmployee();

  beforeEach(() => {
    state = cloneDeep(initialStoreState);
    state.auth.user = {
      ...user,
      groups,
      employee,
    };
    state.auth.groups = { tags: [], permissions: [] };
    state.auth.loadGroupsAsyncInfo = getAsyncState();
  });

  it("isAuthenticated", () => {
    expect(selectors.isAuthenticated(state)).toEqual(true);
  });

  it("currentUserName", () => {
    expect(selectors.currentUserName(state)).toEqual(state.auth.user.name);
  });

  it("currentUserEmail", () => {
    expect(selectors.currentUserEmail(state)).toEqual(state.auth.user.email);
  });

  it("currentUserId", () => {
    expect(selectors.currentUserId(state)).toEqual(state.auth.user.id);
  });

  it("currentUserGroups", () => {
    expect(selectors.currentUserGroups(state)).toEqual(state.auth.user.groups);
  });

  it("currentEmployeeId", () => {
    expect(selectors.currentEmployeeId(state)).toEqual(
      state.auth.user.employeeId,
    );
  });

  it("currentSlackUserId", () => {
    expect(selectors.currentSlackUserId(state)).toEqual(
      state.auth.user.employee.slackUserId,
    );
  });

  it("currentEmployeeAvatar", () => {
    expect(selectors.currentEmployeeAvatar(state)).toEqual(
      state.auth.user.avatar,
    );
  });

  it("getLoadPermissionsAsyncState", () => {
    expect(selectors.getLoadPermissionsAsyncState(state)).toEqual(
      state.auth.loadGroupsAsyncInfo,
    );
  });

  it("getHasSlack", () => {
    expect(selectors.getHasSlack(state, Permission.SLACK_APP_INSTALL)).toBe(
      false,
    );
  });

  it("employees", () => {
    expect(selectors.employees(state)).toEqual(state.auth.user.employees);
  });

  it("hasMultipleCompanies", () => {
    expect(selectors.hasMultipleCompanies(state)).toEqual(false);
  });

  it("getCurrentUserGroups", () => {
    const expectedState = [
      {
        value: state.auth.user.groups[0].id,
        label: state.auth.user.groups[0].name,
      },
    ];

    expect(selectors.getCurrentUserGroups(state)).toEqual(expectedState);
  });
});
