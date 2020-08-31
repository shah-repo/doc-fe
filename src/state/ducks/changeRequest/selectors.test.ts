import { cloneDeep } from "lodash";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getApprover, getAudit, getChangeRequest } from "./tests/factories";
import { ChangeRequestsAllIdsState, ChangeRequestsApproversAllIdsState, ChangeRequestsApproversByIdState, ChangeRequestsByIdState } from "./types";

describe("change requests selectors tests", () => {
  let state: ApplicationState;
  const changeRequests = [getChangeRequest(), getChangeRequest()];
  const approvers = [getApprover(), getApprover()];
  const allIds: ChangeRequestsAllIdsState = [changeRequests[0].id, changeRequests[1].id];
  const byId: ChangeRequestsByIdState = {
    [changeRequests[0].id]: changeRequests[0],
    [changeRequests[1].id]: changeRequests[1],
  };
  const approversAllIds: ChangeRequestsApproversAllIdsState = [approvers[0].id, approvers[1].id];
  const approversById: ChangeRequestsApproversByIdState = {
    [approvers[0].id]: approvers[0],
    [approvers[1].id]: approvers[1],
  };
  const audit = [getAudit(), getAudit()];
  const auditsByCRId = {
    [audit[0].groupId]: { [changeRequests[0].id]: audit },
  };

  beforeAll(() => {
    state = cloneDeep(initialStoreState);
    state.changeRequests.allIds = allIds;
    state.changeRequests.byId = byId;
    state.changeRequests.approversAllIds = approversAllIds;
    state.changeRequests.approversById = approversById;
    state.changeRequests.auditsByCRId = auditsByCRId;
    state.changeRequests.loadAsyncInfo = getAsyncState();
    state.changeRequests.loadListAsyncInfo = getAsyncState();
    state.changeRequests.loadApproversAsyncInfo = getAsyncState();
    state.changeRequests.loadAuditAsyncInfo = getAsyncState();
  });

  it("getChangeRequestsList", () => {
    expect(selectors.getChangeRequestsList(state)).toEqual(changeRequests);
  });

  it("getApproversListForAssessmentForm", () => {
    const expectedResult = [
      { value: approvers[0].id, label: approvers[0].user.name },
      { value: approvers[1].id, label: approvers[1].user.name },
    ];
    expect(selectors.getApproversListForAssessmentForm(state)).toEqual(expectedResult);
  });

  it("getChangeRequest", () => {
    expect(selectors.getChangeRequest(state, changeRequests[0].id)).toEqual(changeRequests[0]);
  });

  it("getLoadAsyncState", () => {
    expect(selectors.getLoadAsyncState(state)).toBe(state.changeRequests.loadAsyncInfo);
  });

  it("getLoadListAsyncState", () => {
    expect(selectors.getLoadListAsyncState(state)).toBe(state.changeRequests.loadListAsyncInfo);
  });

  it("getLoadApproversAsyncState", () => {
    expect(selectors.getLoadApproversAsyncState(state)).toBe(state.changeRequests.loadApproversAsyncInfo);
  });

  it("getLoadAuditAsyncState", () => {
    expect(selectors.getLoadAuditAsyncState(state)).toBe(state.changeRequests.loadAuditAsyncInfo);
  });
});
