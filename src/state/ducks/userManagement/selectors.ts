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
      type: groups[id].type,
      defaultForNewUsers: groups[id].defaultForNewUsers,
      permissions: groups[id].permissions,
      parents: groups[id].parents,
      joinedParents: groups[id].joinedParents,
      isOfficial: groups[id].isOfficial,
    }))
  ),
);

const getDefaultGroups = createSelector(
  getGroupsOptions,
  (groupOptions) => groupOptions.filter((option) => option.defaultForNewUsers),
);

const getOfficialGroups = createSelector(
  getGroupsOptions,
  (groupOptions) => groupOptions.filter((option) => option.isOfficial),
);

export default {
  getGroupsOptions,
  getLoadGroupsAsyncState,
  getDefaultGroups,
  getOfficialGroups,
};
