import moment from 'moment';
import { combineReducers } from 'redux';
import { MomentFormats } from '../../../common/utils/date';
import Colors from '../../../ui/layout/theme/utils/colors';
import asyncReducer from '../../reducers/asyncReducer';
import { COMPANY_DEFAULT_STATE } from '../company/reducers';
import { EDIT_EMPLOYEE_GROUPS, EDIT_EMPLOYEE_USER_INFO } from '../tableSearch/constants';
import { EditGroupsAction, EditUserInfoAction } from '../tableSearch/types';
import { AUTH_USER, LOGOUT_USER, PING_SERVER_GET_ASYNC, SET_CREDENTIALS, SET_EMPLOYEE, TOGGLE_CUSTOM_LABELS, USERS_ME_URL, USER_GROUPS, USER_GROUPS_GET_ASYNC } from './constants';
import { AuthUserAction, EditUserMeAction, GroupTag, LogoutUserAction, Permission, SelectEmployeeAction, SetCredentialsAction, ToggleCustomLabelsAction, UserGroupsAction, UserGroupsState, UserState } from './types';

export const DEFAULT_EMPLOYEE = {
  id: '',
  active: true,
  company: COMPANY_DEFAULT_STATE,
  slackUserId: '',
};

const DEFAULT_CREDENTIALS = {
  credentials: {
    AccessKeyId: '',
    SecretAccessKey: '',
    SessionToken: '',
    Expiration: new Date(0).toISOString(),
  },
  endpoint: '',
  environment: '',
  companyId: '',
  region: '',
  employeeId: '',
};

const USER_DEFAULT_STATE: UserState = {
  email: '',
  name: '',
  id: '',
  employeeId: '',
  sessionId: '',
  employees: [],
  avatar: '',
  groups: [],
  employee: DEFAULT_EMPLOYEE,
  iotCredentials: DEFAULT_CREDENTIALS,
  customLabels: false,
  daysUntilPasswordExpires: 90,
  passwordSoonToExpire: false,
  initialColor: Colors.deep_purple,
};

type AuthUserActions =
  | AuthUserAction
  | LogoutUserAction
  | SelectEmployeeAction
  | EditUserMeAction
  | EditUserInfoAction
  | UserGroupsAction
  | EditGroupsAction
  | SetCredentialsAction
  | ToggleCustomLabelsAction;

const user = (
  state: UserState = USER_DEFAULT_STATE,
  action: AuthUserActions,
): UserState => {
  switch (action.type) {
    case AUTH_USER: {

      const { passwordExpiresAt } = action.payload;
      const currentDate = moment.utc().format(MomentFormats.MonthDateYear);

      return {
        ...state,
        ...action.payload,
        daysUntilPasswordExpires: moment(passwordExpiresAt).diff(moment(currentDate), 'days'),
      };
    }
    case SET_EMPLOYEE:
      return {
        ...state,
        employeeId: action.payload.id,
        employee: action.payload,
      };
    case SET_CREDENTIALS:
      return {
        ...state,
        iotCredentials: action.payload,
      };
    case TOGGLE_CUSTOM_LABELS:
      return {
        ...state,
        customLabels: action.payload,
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

const USER_GROUPS_DEFAULT_STATE: UserGroupsState = {
  tags: [],
  permissions: [],
};

const groups = (
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
