import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { Employee } from "../company";
import { COMPANY_DEFAULT_STATE } from "../company/reducers";
import { EditGroupsAction, EditUserInfoAction } from "../tableSearch";
import { EDIT_EMPLOYEE_GROUPS, EDIT_EMPLOYEE_USER_INFO } from "../tableSearch/constants";
import { AUTH_USER, LOGOUT_USER, PING_SERVER_GET_ASYNC, SET_EMPLOYEE, USERS_ME_URL, USER_GROUPS, USER_GROUPS_GET_ASYNC } from "./constants";
import { AuthUserAction, EditUserMeAction, GroupTag, LogoutUserAction, Permission, SelectEmployeeAction, UserGroupsAction, UserGroupsState, UserState } from "./types";

export const DEFAULT_EMPLOYEE = {
  id: "",
  active: true,
  company: COMPANY_DEFAULT_STATE,
  slackUserId: "",
};

export const USER_DEFAULT_STATE: UserState = {
  email: "",
  name: "",
  id: "",
  employeeId: "",
  sessionId: "",
  employees: [],
  avatar: "",
  groups: [],
  employee: DEFAULT_EMPLOYEE,
};

type AuthUserActions =
  | AuthUserAction
  | LogoutUserAction
  | SelectEmployeeAction
  | EditUserMeAction
  | EditUserInfoAction
  | UserGroupsAction
  | EditGroupsAction;

export const user = (
  state: UserState = USER_DEFAULT_STATE,
  action: AuthUserActions,
): UserState => {
  switch (action.type) {
    case AUTH_USER: {
      const activeUser = action.payload.employees.find((employee) => employee.active) || { id: "" } as Employee;
      return {
        ...state,
        ...action.payload,
        employeeId: activeUser.id,
        employee: activeUser,
      };
    }
    case SET_EMPLOYEE:
      return {
        ...state,
        employeeId: action.payload.id,
        employee: action.payload,
      };
    case USERS_ME_URL:
      return {
        ...state,
        name: action.payload.name,
        avatar: action.payload.avatar,
      };
    case EDIT_EMPLOYEE_USER_INFO:
      if (state.id === action.payload.id) {
        return {
          ...state,
          name: action.payload.name,
          avatar: action.payload.avatar,
        };
      }
      return state;
    case USER_GROUPS:
      return {
        ...state,
        groups: action.payload,
      };
    case EDIT_EMPLOYEE_GROUPS:
      if (state.id === action.payload.user.id) {
        return {
          ...state,
          groups: action.payload.groups,
        };
      }
      return state;
    case LOGOUT_USER:
      return { ...USER_DEFAULT_STATE };
    default:
      return state;
  }
};

export const USER_GROUPS_DEFAULT_STATE: UserGroupsState = {
  tags: [],
  permissions: [],
};

export const groups = (
  state: UserGroupsState = USER_GROUPS_DEFAULT_STATE,
  action: UserGroupsAction | LogoutUserAction,
): UserGroupsState => {
  switch (action.type) {
    case USER_GROUPS: {
      const tagsSet = new Set<GroupTag>();
      const permissionsSet = new Set<Permission>();
      action.payload.forEach((group) => {
        const { joinedTags, joinedPermissions } = group;

        if (joinedTags) {
          joinedTags.forEach((tag) => tagsSet.add(tag));
        }

        if (joinedPermissions) {
          joinedPermissions.forEach((permission) => permissionsSet.add(permission));
        }
      });

      return {
        tags: Array.from(tagsSet),
        permissions: Array.from(permissionsSet),
      };
    }
    case LOGOUT_USER:
      return { ...USER_GROUPS_DEFAULT_STATE };
    default:
      return state;
  }
};

const reducer = combineReducers({
  user,
  loadGroupsAsyncInfo: asyncReducer(USER_GROUPS_GET_ASYNC),
  pingServerAsyncInfo: asyncReducer(PING_SERVER_GET_ASYNC),
  groups,
});

export default reducer;
