import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const groupsById = (state: ApplicationState) => state.userManagement.groupsById;
const groupsAllIds = (state: ApplicationState) => state.userManagement.groupsAllIds;
const getLoadGroupsAsyncState = (state: ApplicationState): AsyncState => state.userManagement.loadGroupsListAsyncInfo;

const getGroupsOptions = createSelector(
  groupsAllIds, groupsById,
  (ids, groups) => (
    ids.map((id) => ({
      label: groups[id].name,
      text: groups[id].name,
      value: groups[id].id,
    }))
  ),
);

export default {
  getGroupsOptions,
  getLoadGroupsAsyncState,
};
