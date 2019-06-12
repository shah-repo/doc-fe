import _ from "lodash";
import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import {
  CHANGE_REQUEST_GET_ASYNC,
  CHANGE_REQUEST_SET,
  CHANGE_REQUEST_LIST,
  CHANGE_REQUEST_LIST_ASYNC,
  CHANGE_REQUEST_GET_APPROVERS_ASYNC,
  CHANGE_REQUEST_LIST_APPROVERS,
} from "./constants";
import {
  ChangeRequest,
  ChangeRequestSetAction,
  ChangeRequestListAction,
  ChangeRequestsByIdState,
  ChangeRequestsAllIdsState,
  ChangeRequestsApproversByIdState,
  ChangeRequestListApproversAction,
  ChangeRequestAvailableApprovers,
  ChangeRequestsApproversAllIdsState,
} from "./types";

type ChangeRequestActions = ChangeRequestSetAction | ChangeRequestListAction;

export const byId = (state: ChangeRequestsByIdState = {}, action: ChangeRequestActions): ChangeRequestsByIdState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST:
      return { ...state, ...(_.keyBy<ChangeRequest>(action.payload, (changeRequest) => changeRequest.id)) };
    case CHANGE_REQUEST_SET:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

export const allIds = (state: ChangeRequestsAllIdsState = [], action: ChangeRequestActions): ChangeRequestsAllIdsState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST:
      return _.uniq([...state, ...action.payload.map((changeRequest) => changeRequest.id)]);
    case CHANGE_REQUEST_SET:
      return _.uniq([...state, action.payload.id]);
    default:
      return state;
  }
};

export const approversById = (state: ChangeRequestsApproversByIdState = {}, action: ChangeRequestListApproversAction): ChangeRequestsApproversByIdState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST_APPROVERS:
      return { ...state, ...(_.keyBy<ChangeRequestAvailableApprovers>(action.payload, (approver) => approver.id)) };
    default:
      return state;
  }
};

export const approversAllIds = (state: ChangeRequestsApproversAllIdsState = [], action: ChangeRequestListApproversAction): ChangeRequestsApproversAllIdsState => {
  switch (action.type) {
    case CHANGE_REQUEST_LIST_APPROVERS:
      return _.uniq([...state, ...action.payload.map((approver) => approver.id)]);
    default:
      return state;
  }
};

export default combineReducers({
  loadListAsyncInfo: asyncReducer(CHANGE_REQUEST_LIST_ASYNC),
  loadAsyncInfo: asyncReducer(CHANGE_REQUEST_GET_ASYNC),
  loadApproversAsyncInfo: asyncReducer(CHANGE_REQUEST_GET_APPROVERS_ASYNC),
  byId,
  allIds,
  approversById,
  approversAllIds,
});
