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
      tags: groups[id].tags,
      permissions: groups[id].permissions,
      parentGroups: groups[id].parentGroups,
    }))
  ),
);

export default {
  getGroupsOptions,
  getLoadGroupsAsyncState,
};
