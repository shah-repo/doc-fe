import { createSelector } from "reselect";
import { SelectOption } from "../../../ui/components/forms/fields/Select";
import { ApplicationState } from "../../reducers";

const groupsById = (state: ApplicationState) => state.userManagement.groupsById;
const groupsAllIds = (state: ApplicationState) => state.userManagement.groupsAllIds;

const getGroupsOptions = createSelector(
  groupsAllIds, groupsById,
  (ids, groups): SelectOption[] =>
    ids.map((id) => ({ text: groups[id].name, value: groups[id].id })),
);

export default {
  getGroupsOptions,
};
