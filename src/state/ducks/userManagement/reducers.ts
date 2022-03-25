import { get, isEmpty, keyBy, set, unionBy, uniq } from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { COMPANY_GROUPS_GET_ASYNC, COMPANY_GROUPS_LIST, HISTORY_LIST, HISTORY_LIST_ASYNC, HISTORY_LIST_INITIAL_STATE } from "./constants";
import { CompanyGroupsListAction, GroupsAllIdsState, GroupsByIdState, HistoryListAction, HistoryState, LoadCompanyGroup } from "./types";

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

const history = (
  state: HistoryState = HISTORY_LIST_INITIAL_STATE,
  action: HistoryListAction
): HistoryState => {
  const actionResult = get(action.payload, "results");
  const stateResult = get(state, "results");
  const combineResult = isEmpty(stateResult) ? actionResult : unionBy(stateResult, actionResult, "id");
  switch (action.type) {
    case HISTORY_LIST:
      return action.initialLoad ? action.payload : set(action.payload, "results", combineResult);
    default:
      return state;
  }
};
export default combineReducers({
  loadGroupsListAsyncInfo: asyncReducer(COMPANY_GROUPS_GET_ASYNC),
  groupsById,
  groupsAllIds,
  history,
  loadHistoryAsyncInfo: asyncReducer(HISTORY_LIST_ASYNC),
});
