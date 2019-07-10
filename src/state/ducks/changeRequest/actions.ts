import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  CHANGE_REQUEST_AUDIT_SET,
  CHANGE_REQUEST_GET_APPROVERS_ASYNC,
  CHANGE_REQUEST_GET_ASYNC,
  CHANGE_REQUEST_GET_AUDIT_ASYNC,
  CHANGE_REQUEST_LIST,
  CHANGE_REQUEST_LIST_APPROVERS,
  CHANGE_REQUEST_LIST_ASYNC,
  CHANGE_REQUEST_ROOT_URL,
  CHANGE_REQUEST_SET,
} from "./constants";
import {
  Audit,
  AuditActionPayload,
  ChangeRequest,
  ChangeRequestAuditSetAction,
  ChangeRequestAvailableApprovers,
  ChangeRequestAvailableApproversResponse,
  ChangeRequestEditRequestBody,
  ChangeRequestListAction,
  ChangeRequestListApproversAction,
  ChangeRequestSetAction,
  ChangeRequestTransition,
  ChangeRequestTransitionRequestBody,
  ChangeRequestTransitionResponse,
} from "./types";

const changeRequestsList = (changeRequests: ChangeRequest[]): ChangeRequestListAction => ({
  type: CHANGE_REQUEST_LIST,
  payload: changeRequests,
});

const changeRequestSet = (changeRequest: ChangeRequest): ChangeRequestSetAction => ({
  type: CHANGE_REQUEST_SET,
  payload: changeRequest,
});

const loadList = (searchTerms: string = ""): ApiAction<ChangeRequest[]> => apiAction({
  url: `${CHANGE_REQUEST_ROOT_URL}${searchTerms}`,
  method: "get",
  asyncType: CHANGE_REQUEST_LIST_ASYNC,
  onSuccess: (changeRequests, dispatch) => {
    dispatch(changeRequestsList(changeRequests));
  },
});

const load = (id: string): ApiAction<ChangeRequest> => apiAction({
  url: `${CHANGE_REQUEST_ROOT_URL}/${id}`,
  method: "get",
  asyncType: CHANGE_REQUEST_GET_ASYNC,
  onSuccess: (changeRequest, dispatch) => {
    dispatch(changeRequestSet(changeRequest));
  },
});

const availableApproversList = (
  availableApprovers: ChangeRequestAvailableApprovers[],
): ChangeRequestListApproversAction => ({
  type: CHANGE_REQUEST_LIST_APPROVERS,
  payload: availableApprovers,
});

const loadAvailableApprovers = (): ApiAction<ChangeRequestAvailableApproversResponse> => apiAction({
  url: `${CHANGE_REQUEST_ROOT_URL}/available_approvers`,
  method: "get",
  asyncType: CHANGE_REQUEST_GET_APPROVERS_ASYNC,
  onSuccess: (approvers, dispatch) => {
    dispatch(availableApproversList(approvers.optionalApprovers));
  },
});

const create = (body: ChangeRequestEditRequestBody, handlers: Handlers<ChangeRequest>):
  ApiAction<ChangeRequest, ChangeRequestEditRequestBody> => apiActionWithCallbacks({
    url: CHANGE_REQUEST_ROOT_URL,
    method: "post",
    data: body,
    onSuccess: (changeRequest, dispatch) => {
      dispatch(changeRequestSet(changeRequest));
    },
    handlers,
  });

const save = (id: string, body: ChangeRequestEditRequestBody, handlers: Handlers<ChangeRequest>):
  ApiAction<ChangeRequest, ChangeRequestEditRequestBody> => apiActionWithCallbacks({
    url: `${CHANGE_REQUEST_ROOT_URL}/${id}`,
    method: "patch",
    data: body,
    onSuccess: (changeRequest, dispatch) => {
      dispatch(changeRequestSet(changeRequest));
    },
    handlers,
  });

const applyTransition = (
  id: string,
  body: ChangeRequestTransitionRequestBody,
  transition: ChangeRequestTransition,
  handlers: Handlers<ChangeRequestTransitionResponse>,
): ApiAction<ChangeRequestTransitionResponse, ChangeRequestTransitionRequestBody> => apiActionWithCallbacks({
  url: `${CHANGE_REQUEST_ROOT_URL}/${id}/${transition}`,
  method: "post",
  data: body,
  onSuccess: (d, dispatch) => {
    dispatch(load(id));
  },
  handlers,
});

const auditSet = (audit: AuditActionPayload): ChangeRequestAuditSetAction => ({
  type: CHANGE_REQUEST_AUDIT_SET,
  payload: audit,
});

const loadAudit = (id: string): ApiAction<Audit[]> => apiAction({
  url: `${CHANGE_REQUEST_ROOT_URL}/${id}/audit`,
  method: "get",
  asyncType: CHANGE_REQUEST_GET_AUDIT_ASYNC,
  onSuccess: (audit, dispatch) => {
    dispatch(auditSet({
      id,
      audit,
    }));
  },
});

export default {
  changeRequestsList,
  changeRequestSet,
  loadList,
  load,
  create,
  save,
  applyTransition,
  loadAvailableApprovers,
  availableApproversList,
  auditSet,
  loadAudit,
};
