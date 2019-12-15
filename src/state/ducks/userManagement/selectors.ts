import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";

const groupsById = (state: ApplicationState) => state.userManagement.groupsById;
const groupsAllIds = (state: ApplicationState) => state.userManagement.groupsAllIds;
const slackUrl = (state: ApplicationState) => state.userManagement.slackUrl;

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
  slackUrl,
};
