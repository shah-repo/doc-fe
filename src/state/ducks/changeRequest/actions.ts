import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { Audit, AuditActionPayload } from "../audit/types";
import { dashboardActions } from "../dashboard";
import { CHANGE_REQUEST_AUDIT_SET, CHANGE_REQUEST_GET_APPROVERS_ASYNC, CHANGE_REQUEST_GET_ASYNC, CHANGE_REQUEST_GET_AUDIT_ASYNC, CHANGE_REQUEST_LIST, CHANGE_REQUEST_LIST_APPROVERS, CHANGE_REQUEST_LIST_ASYNC, CHANGE_REQUEST_ROOT_URL, CHANGE_REQUEST_SET } from "./constants";
import { ChangeRequest, ChangeRequestAuditSetAction, ChangeRequestAvailableApprovers, ChangeRequestAvailableApproversResponse, ChangeRequestEditRequestBody, ChangeRequestListAction, ChangeRequestListApproversAction, ChangeRequestSetAction, ChangeRequestTransition, ChangeRequestTransitionRequestBody, ChangeRequestTransitionResponse } from "./types";

const changeRequestsList = (changeRequests: ChangeRequest[]): ChangeRequestListAction => ({
  type: CHANGE_REQUEST_LIST,
  payload: changeRequests,
});

const changeRequestSet = (changeRequest: ChangeRequest): ChangeRequestSetAction => ({
  type: CHANGE_REQUEST_SET,
  payload: changeRequest,
});

const loadList = (searchTerms = ""): ApiAction<ChangeRequest[]> => apiAction({
  url: `${CHANGE_REQUEST_ROOT_URL}${searchTerms}`,
  method: "get",
  asyncType: CHANGE_REQUEST_LIST_ASYNC,
  onSuccess: (changeRequests, dispatch) => {
    dispatch(changeRequestsList(changeRequests));
  },
});

const loadListWithCallback = (params: any, handlers: Handlers): ApiAction<ChangeRequest[]> =>
  apiActionWithCallbacks({
    url: `${CHANGE_REQUEST_ROOT_URL}`,
    method: "get",
    params,
    handlers,
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
  password: body.password,
  onSuccess: (d, dispatch) => {
    dispatch(load(id));
    if (transition === "reject" || transition === "approve") {
      dispatch( dashboardActions.loadPendingActionsList());
    }
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

const closeTask = (changeRequestId: string, taskId: string, body: any, handlers: Handlers):
ApiAction => apiActionWithCallbacks({
  url: `${CHANGE_REQUEST_ROOT_URL}/task/${taskId}/done`,
  method: "post",
  data: body,
  onSuccess: (d, dispatch) => {
    dispatch(load(changeRequestId));
  },
  handlers,
});

export default {
  changeRequestsList,
  changeRequestSet,
  loadList,
  loadListWithCallback,
  load,
  create,
  save,
  applyTransition,
  loadAvailableApprovers,
  availableApproversList,
  auditSet,
  loadAudit,
  closeTask,
};
