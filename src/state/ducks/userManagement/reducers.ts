import { get, isEmpty, keyBy, set, unionBy, uniq } from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { COMPANY_GROUPS_GET_ASYNC, COMPANY_GROUPS_LIST, UM_AUDIT_ASYNC, UM_AUDIT_HISTORY_INITIAL_STATE, UM_AUDIT_LIST } from "./constants";
import { CompanyGroupsListAction, GroupsAllIdsState, GroupsByIdState, HistoryState, LoadCompanyGroup, UMAuditHistoryAction } from "./types";

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
  state: HistoryState = UM_AUDIT_HISTORY_INITIAL_STATE,
  action: UMAuditHistoryAction
): HistoryState => {
  const actionResult = get(action.payload, "results");
  const stateResult = get(state, "results");
  const combineResult = isEmpty(stateResult) ? actionResult : unionBy(stateResult, actionResult, "id");
  switch (action.type) {
    case UM_AUDIT_LIST:
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
  loadHistoryAsyncInfo: asyncReducer(UM_AUDIT_ASYNC),
});
