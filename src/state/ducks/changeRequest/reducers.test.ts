import { CHANGE_REQUEST_AUDIT_SET, CHANGE_REQUEST_LIST, CHANGE_REQUEST_LIST_APPROVERS, CHANGE_REQUEST_SET } from "./constants";
import { allIds, approversAllIds, approversById, auditsAllId, auditsByCRId, byId } from "./reducers";
import { getApprover, getAudit, getChangeRequest } from "./tests/factories";
import { ChangeRequest, ChangeRequestAuditSetAction, ChangeRequestAvailableApprovers, ChangeRequestListAction, ChangeRequestListApproversAction, ChangeRequestSetAction } from "./types";

describe("change requests reducers tests", () => {
  const changeRequestList: ChangeRequest[] = [
    getChangeRequest(),
    getChangeRequest(),
  ];
  const changeRequest = getChangeRequest();
  const approversList: ChangeRequestAvailableApprovers[] = [
    getApprover(),
    getApprover(),
  ];
  const audit = [
    getAudit(),
    getAudit(),
  ];
  const auditPayload = {
    id: changeRequest.id,
    audit,
  };

  const changeRequestListAction: ChangeRequestListAction = {
    type: CHANGE_REQUEST_LIST,
    payload: changeRequestList,
  };

  const changeRequestSetAction: ChangeRequestSetAction = {
    type: CHANGE_REQUEST_SET,
    payload: changeRequest,
  };

  const changeRequestListApproverAction: ChangeRequestListApproversAction = {
    type: CHANGE_REQUEST_LIST_APPROVERS,
    payload: approversList,
  };

  const auditAction: ChangeRequestAuditSetAction = {
    type: CHANGE_REQUEST_AUDIT_SET,
    payload: auditPayload,
  };

  describe("byId reducer tests", () => {
    const initialChangeRequest = getChangeRequest();
    const initialState = {
      [initialChangeRequest.id]: initialChangeRequest,
    };

    const expectedState = {
      [changeRequestList[0].id]: changeRequestList[0],
      [changeRequestList[1].id]: changeRequestList[1],
    };

    it("sets ids on CHANGE_REQUEST_LIST action", () => {
      expect(byId(initialState, changeRequestListAction)).toEqual(expectedState);
    });

    it("sets new changeRequest on CHANGE_REQUEST_SET action", () => {
      expect(byId(initialState, changeRequestSetAction)).toEqual({
        ...initialState,
        [changeRequest.id]: changeRequest,
      });
    });
  });

  describe("allIds reducer tests", () => {
    const initialChangeRequest = getChangeRequest();
    const initialState = [initialChangeRequest.id];

    const expectedState = [
      changeRequestList[0].id,
      changeRequestList[1].id,
    ];

    it("sets ids on CHANGE_REQUEST_LIST action", () => {
      expect(allIds(initialState, changeRequestListAction)).toEqual(expectedState);
    });

    it("sets new change request on CHANGE_REQUEST_SET action", () => {
      expect(allIds(initialState, changeRequestSetAction)).toEqual([
        ...initialState,
        changeRequest.id,
      ]);
    });
  });

  describe("approversById reducer tests", () => {
    const initialApprover = getApprover();
    const initialState = {
      [initialApprover.id]: initialApprover,
    };

    const expectedState = {
      ...initialState,
      [approversList[0].user.id]: approversList[0],
      [approversList[1].user.id]: approversList[1],
    };

    it("sets ids on CHANGE_REQUEST_LIST_APPROVERS action", () => {
      expect(approversById(initialState, changeRequestListApproverAction)).toEqual(expectedState);
    });
  });

  describe("approversAllIds reducer tests", () => {
    const initialApprover = getApprover();
    const initialState = [initialApprover.id];

    const expectedState = [
      ...initialState,
      approversList[0].user.id,
      approversList[1].user.id,
    ];

    it("sets ids on CHANGE_REQUEST_LIST_APPROVERS action", () => {
      expect(approversAllIds(initialState, changeRequestListApproverAction)).toEqual(expectedState);
    });
  });

  describe("auditsByCRId reducer tests", () => {
    const initialState = {};

    const expectedState = {
      ...initialState,
      [changeRequest.id]: { 1: audit },
    };

    it("sets ids on CHANGE_REQUEST_AUDIT_SET action", () => {
      expect(auditsByCRId(initialState, auditAction)).toEqual(expectedState);
    });
  });

  describe("auditsAllId reducer tests", () => {
    const initialState = [changeRequestList[0].id];

    const expectedState = [
      ...initialState,
      changeRequest.id,
    ];

    it("sets ids on CHANGE_REQUEST_AUDIT_SET action", () => {
      expect(auditsAllId(initialState, auditAction)).toEqual(expectedState);
    });
  });
});
