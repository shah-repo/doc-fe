import { groupBy, keyBy, uniq } from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { AuditByCRIdState } from "../audit/types";
import { CHANGE_REQUEST_AUDIT_SET, CHANGE_REQUEST_GET_APPROVERS_ASYNC, CHANGE_REQUEST_GET_ASYNC, CHANGE_REQUEST_GET_AUDIT_ASYNC, CHANGE_REQUEST_LIST, CHANGE_REQUEST_LIST_APPROVERS, CHANGE_REQUEST_LIST_ASYNC, CHANGE_REQUEST_SET } from "./constants";
import { allIdsState, ChangeRequest, ChangeRequestAuditSetAction, ChangeRequestAvailableApprovers, ChangeRequestListAction, ChangeRequestListApproversAction, ChangeRequestsAllIdsState, ChangeRequestsApproversAllIdsState, ChangeRequestsApproversByIdState, ChangeRequestsByIdState, ChangeRequestSetAction } from "./types";

type ChangeRequestActions = ChangeRequestSetAction | ChangeRequestListAction;

export const byId = (
  state: ChangeRequestsByIdState = {},
  action: ChangeRequestActions,
): ChangeRequestsByIdState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST:
      return {
        ...keyBy<ChangeRequest>(
          action.payload,
          (changeRequest) => changeRequest.id,
        ),
      };
    case CHANGE_REQUEST_SET: {
      const newState: ChangeRequest = {
        ...action.payload,
        // approvals: action.payload.approvals.filter((a) => a.active),
        approvals: action.payload.approvals,
      };
      return { ...state, [action.payload.id]: newState };
    }
    default:
      return state;
  }
};

export const allIds = (
  state: ChangeRequestsAllIdsState = [],
  action: ChangeRequestActions,
): ChangeRequestsAllIdsState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST:
      return uniq([...action.payload.map((changeRequest) => changeRequest.id)]);
    case CHANGE_REQUEST_SET:
      return uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

export const approversById = (
  state: ChangeRequestsApproversByIdState = {},
  action: ChangeRequestListApproversAction,
): ChangeRequestsApproversByIdState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST_APPROVERS:
      return {
        ...state,
        ...keyBy<ChangeRequestAvailableApprovers>(
          action.payload,
          (approver) => approver.user.id,
        ),
      };
    default:
      return state;
  }
};
export const approversAllIds = (
  state: ChangeRequestsApproversAllIdsState = [],
  action: ChangeRequestListApproversAction,
): ChangeRequestsApproversAllIdsState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST_APPROVERS:
      return uniq([
        ...state,
        ...action.payload.map((approver) => approver.user.id),
      ]);
    default:
      return state;
  }
};

export const auditsByCRId = (
  state: AuditByCRIdState = {},
  action: ChangeRequestAuditSetAction,
): AuditByCRIdState => {
  switch (action.type) {
    case CHANGE_REQUEST_AUDIT_SET: {
      const audits = groupBy(action.payload.audit, "groupId");
      return { ...state, [action.payload.id]: audits };
    }
    default:
      return state;
  }
};

export const auditsAllId = (
  state: allIdsState = [],
  action: ChangeRequestAuditSetAction,
): allIdsState => {
  switch (action.type) {
    case CHANGE_REQUEST_AUDIT_SET:
      return uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

export default combineReducers({
  loadListAsyncInfo: asyncReducer(CHANGE_REQUEST_LIST_ASYNC),
  loadAsyncInfo: asyncReducer(CHANGE_REQUEST_GET_ASYNC),
  loadApproversAsyncInfo: asyncReducer(CHANGE_REQUEST_GET_APPROVERS_ASYNC),
  loadAuditAsyncInfo: asyncReducer(CHANGE_REQUEST_GET_AUDIT_ASYNC),
  byId,
  allIds,
  approversById,
  approversAllIds,
  auditsByCRId,
  auditsAllId,
});
