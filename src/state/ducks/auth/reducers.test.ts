import faker from "faker";
import { getEmployee } from "../company/tests/factories";
import { EDIT_EMPLOYEE_GROUPS, EDIT_EMPLOYEE_USER_INFO } from "../tableSearch/constants";
import {
  EditGroupsAction, EditUserInfoAction,
} from "../tableSearch/types";
import { getGroup } from "../userManagement/tests/factories";
import { AUTH_USER, LOGOUT_USER, SET_EMPLOYEE, USERS_ME_URL, USER_GROUPS } from "./constants";
import {
  groups,
  user,
  USER_DEFAULT_STATE,
  USER_GROUPS_DEFAULT_STATE,
} from "./reducers";
import { getAuthResponse, getUser } from "./tests/factories";
import {
  AuthUserAction, EditUserMeAction,
  LogoutUserAction, SelectEmployeeAction, UserGroupsAction,
} from "./types";

describe("user reducer tests", () => {
  const initialState = USER_DEFAULT_STATE;
  const authResponse = getAuthResponse();
  const employee = getEmployee();
  const userResponse = getUser();
  const currentUserResponse = { ...getUser(), id: initialState.id };
  const groupsResponse = [getGroup()];
  const employeeResponse = {
    id: faker.random.uuid(),
    active: true,
    groups: groupsResponse,
    user: {
      id: faker.random.uuid(),
      email: faker.internet.email(),
      name: faker.name.firstName(),
    },
  };

  const authUserAction: AuthUserAction = {
    type: AUTH_USER,
    payload: authResponse,
  };

  const selectEmployeeAction: SelectEmployeeAction = {
    type: SET_EMPLOYEE,
    payload: employee,
  };

  const editUserMeAction: EditUserMeAction = {
    type: USERS_ME_URL,
    payload: userResponse,
  };

  const userGroupsAction: UserGroupsAction = {
    type: USER_GROUPS,
    payload: groupsResponse,
  };

  const logoutUserAction: LogoutUserAction = {
    type: LOGOUT_USER,
  };

  it("sets user on AUTH_USER", () => {
    expect(user(initialState, authUserAction)).toEqual({
      ...initialState,
      ...authResponse,
      employeeId: authResponse.employees[0].id,
      employee: authResponse.employees[0],
      groups: [],
    });
  });

  it("sets employee on SET_EMPLOYEE", () => {
    expect(user(initialState, selectEmployeeAction)).toEqual({
      ...initialState,
      employeeId: employee.id,
      employee,
    });
  });

  it("sets current user info on USERS_ME_URL", () => {
    expect(user(initialState, editUserMeAction)).toEqual({
      ...initialState,
      name: userResponse.name,
      avatar: userResponse.avatar,
    });
  });

  it("sets employee on EDIT_EMPLOYEE_USER_INFO if it's current user", () => {
    const editUserInfoAction: EditUserInfoAction = {
      type: EDIT_EMPLOYEE_USER_INFO,
      payload: currentUserResponse,
    };
    expect(user(initialState, editUserInfoAction)).toEqual({
      ...initialState,
      name: currentUserResponse.name,
      avatar: currentUserResponse.avatar,
    });
  });

  it("does not set employee on EDIT_EMPLOYEE_USER_INFO if it isn't current user", () => {
    const editUserInfoAction: EditUserInfoAction = {
      type: EDIT_EMPLOYEE_USER_INFO,
      payload: userResponse,
    };
    expect(user(initialState, editUserInfoAction)).toEqual({
      ...initialState,
    });
  });

  it("sets groups on USER_GROUPS", () => {
    expect(user(initialState, userGroupsAction)).toEqual({
      ...initialState,
      groups: groupsResponse,
    });
  });

  it("sets employee groups on EDIT_EMPLOYEE_GROUPS if it's current user", () => {
    const editGroupsAction: EditGroupsAction = {
      type: EDIT_EMPLOYEE_GROUPS,
      payload: {
        ...employeeResponse,
        user: { ...employeeResponse.user, id: initialState.id },
      },
    };
    expect(user(initialState, editGroupsAction)).toEqual({
      ...initialState,
      groups: employeeResponse.groups,
    });
  });

  it("does not set employee groups on EDIT_EMPLOYEE_GROUPS if it isn't current user", () => {
    const editGroupsAction: EditGroupsAction = {
      type: EDIT_EMPLOYEE_GROUPS,
      payload: employeeResponse,
    };
    expect(user(initialState, editGroupsAction)).toEqual({
      ...initialState,
    });
  });

  it("resets state on LOGOUT_USER", () => {
    expect(user(initialState, logoutUserAction)).toEqual(USER_DEFAULT_STATE);
  });
});

describe("groups reducer tests", () => {
  const initialState = USER_GROUPS_DEFAULT_STATE;
  const groupsResponse = [getGroup()];

  const userGroupsAction: UserGroupsAction = {
    type: USER_GROUPS,
    payload: groupsResponse,
  };

  const logoutUserAction: LogoutUserAction = {
    type: LOGOUT_USER,
  };

  it("sets tags and permissions on USER_GROUPS", () => {
    expect(groups(initialState, userGroupsAction)).toEqual({
      ...initialState,
      tags: [],
      permissions: [],
    });
  });

  it("resets state on user logout", () => {
    expect(groups(initialState, logoutUserAction)).toEqual(
      USER_GROUPS_DEFAULT_STATE,
    );
  });
});
