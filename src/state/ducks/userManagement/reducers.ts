import { keyBy, uniq } from "lodash";
import { combineReducers } from "redux";
import { CompanyGroupsListAction, COMPANY_GROUPS_GET_ASYNC, COMPANY_GROUPS_LIST, GroupsAllIdsState, GroupsByIdState, LoadCompanyGroup } from ".";
import asyncReducer from "../../reducers/asyncReducer";

export const groupsById = (
  state: GroupsByIdState = {},
  action: CompanyGroupsListAction,
): GroupsByIdState => {
  switch (action.type) {
    case COMPANY_GROUPS_LIST:
      return {
        ...keyBy<LoadCompanyGroup>(
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
      return uniq([...action.payload.map((group) => group.id)]);
    default:
      return state;
  }
};

export default combineReducers({
  loadGroupsListAsyncInfo: asyncReducer(COMPANY_GROUPS_GET_ASYNC),
  groupsById,
  groupsAllIds,
});
