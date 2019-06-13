import _ from "lodash";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getChangeRequest, getApprover } from "./tests/factories";
import { ChangeRequestsAllIdsState, ChangeRequestsByIdState, ChangeRequestsApproversAllIdsState, ChangeRequestsApproversByIdState } from "./types";

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

  beforeAll(() => {
    state = _.cloneDeep(initialStoreState);
    state.changeRequests.allIds = allIds;
    state.changeRequests.byId = byId;
    state.changeRequests.approversAllIds = approversAllIds;
    state.changeRequests.approversById = approversById;
    state.changeRequests.loadAsyncInfo = getAsyncState();
    state.changeRequests.loadListAsyncInfo = getAsyncState();
    state.changeRequests.loadApproversAsyncInfo = getAsyncState();
  });

  it("getChangeRequestsList", () => {
    expect(selectors.getChangeRequestsList(state)).toEqual(changeRequests);
  });

  it("getApproversListForAssessmentForm", () => {
    const expectedResult = [
      { value: approvers[0].email, label: approvers[0].name },
      { value: approvers[1].email, label: approvers[1].name }
    ]
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
});
