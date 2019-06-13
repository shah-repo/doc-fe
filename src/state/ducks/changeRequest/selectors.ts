import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";

const allIds = (state: ApplicationState) => state.changeRequests.allIds;
const byId = (state: ApplicationState) => state.changeRequests.byId;
const approversById = (state: ApplicationState) => state.changeRequests.approversById;
const approversAllIds = (state: ApplicationState) => state.changeRequests.approversAllIds;

const getChangeRequestsList = createSelector(
  allIds, byId,
  (ids, changeRequests) => ids.map((id) => changeRequests[id]),
);

const getApproversListForAssessmentForm = createSelector(
  approversAllIds, approversById,
  (ids, approvers): OptionType[] => ids.map((id) => ({ value: approvers[id].email, label: approvers[id].name })),
);

const getChangeRequest = (state: ApplicationState, changeRequestId: string) => byId(state)[changeRequestId];

const getLoadAsyncState = (state: ApplicationState): AsyncState => state.changeRequests.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.changeRequests.loadListAsyncInfo;
const getLoadApproversAsyncState = (state: ApplicationState): AsyncState => state.changeRequests.loadApproversAsyncInfo;

export default {
  getChangeRequestsList,
  getChangeRequest,
  getLoadAsyncState,
  getLoadListAsyncState,
  getLoadApproversAsyncState,
  getApproversListForAssessmentForm,
};
