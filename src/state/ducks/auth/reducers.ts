import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { EditGroupsAction, EditUserInfoAction } from "../tableSearch";
import {
  EDIT_EMPLOYEE_GROUPS,
  EDIT_EMPLOYEE_USER_INFO,
} from "../tableSearch/constants";
import {
  AUTH_USER,
  LOGOUT_USER,
  SET_EMPLOYEE,
  USER_GROUPS,
  USER_GROUPS_GET_ASYNC,
  USERS_ME_URL,
} from "./constants";
import {
  AuthUserAction,
  EditUserMeAction,
  GroupTag,
  LogoutUserAction,
  Permission,
  SelectEmployeeAction,
  UserGroupsAction,
  UserGroupsState,
  UserState,
} from "./types";

export const USER_DEFAULT_STATE: UserState = {
  email: "",
  name: "",
  id: "",
  employeeId: "",
  sessionId: "",
  employees: [],
  avatar: "",
  groups: [],
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
    case AUTH_USER:
      return {
        ...state,
        email: action.payload.email,
        avatar: action.payload.avatar,
        name: action.payload.name,
        id: action.payload.id,
        employeeId: action.payload.employeeId,
        sessionId: action.payload.sessionId,
        employees: action.payload.employees,
      };
    case SET_EMPLOYEE:
      return {
        ...state,
        employeeId: action.payload.id,
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
  action: UserGroupsAction,
): UserGroupsState => {
  switch (action.type) {
    case USER_GROUPS:
      const tagsSet = new Set<GroupTag>();
      const permissionsSet = new Set<Permission>();
      action.payload.forEach((group) => {
        const { tags, permissions } = group;

        if (tags) {
          tags.forEach((tag) => tagsSet.add(tag));
        }

        if (permissions) {
          permissions.forEach((permission) => permissionsSet.add(permission));
        }
      });

      return {
        tags: Array.from(tagsSet),
        permissions: Array.from(permissionsSet),
      };
    default:
      return state;
  }
};

const reducer = combineReducers({
  user,
  loadGroupsAsyncInfo: asyncReducer(USER_GROUPS_GET_ASYNC),
  groups,
});

export default reducer;
