import _ from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { API_TOKEN_LIST, COMPANY_GROUPS_GET_ASYNC, COMPANY_GROUPS_LIST } from "./constants";
import { ApiTokenListAction, CompanyGroupsListAction, GetApiTokenList, GroupsAllIdsState, GroupsByIdState, LoadCompanyGroup } from "./types";

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

export const apiTokenList = (
  state: GetApiTokenList[] = [],
  action: ApiTokenListAction,
): GetApiTokenList[] => {
  switch (action.type) {
    case API_TOKEN_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  loadGroupsListAsyncInfo: asyncReducer(COMPANY_GROUPS_GET_ASYNC),
  groupsById,
  groupsAllIds,
  apiTokenList,
});
