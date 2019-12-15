import _ from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import {
  COMPANY_GROUPS_GET_ASYNC,
  COMPANY_GROUPS_LIST,
  SLACK_URL_GET_ASYNC,
} from "./constants";
import {
  CompanyGroupsListAction,
  GetSlackUrlAction,
  GroupsAllIdsState,
  GroupsByIdState,
  LoadCompanyGroup,
} from "./types";

export const groupsById = (
  state: GroupsByIdState = {},
  action: CompanyGroupsListAction,
): GroupsByIdState => {
  switch (action.type) {
    case COMPANY_GROUPS_LIST:
      return {
        ..._.keyBy<LoadCompanyGroup>(
          action.payload,
          (group) => group.id,
        ),
      };
    default:
      return state;
  }
};

export const groupsAllIds = (
  state: GroupsAllIdsState = [],
  action: CompanyGroupsListAction,
): GroupsAllIdsState => {
  switch (action.type) {
    case COMPANY_GROUPS_LIST:
      return _.uniq([...action.payload.map((group) => group.id)]);
    default:
      return state;
  }
};

const slackUrl = (state: string = "", action: GetSlackUrlAction): string => {
  if (action.type === SLACK_URL_GET_ASYNC) {
    return action.payload;
  }
  return state;
};

export default combineReducers({
  loadGroupsListAsyncInfo: asyncReducer(COMPANY_GROUPS_GET_ASYNC),
  groupsById,
  groupsAllIds,
  slackUrl,
});
