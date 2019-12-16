import { createSelector } from "reselect";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { Nullable } from "../common";
import { Group, GroupTag } from "./types";

const isAuthenticated = (state: ApplicationState): boolean => {
  return Boolean(state.auth.user.sessionId && state.auth.user.employeeId);
};

const currentUserEmail = (state: ApplicationState): string =>
  state.auth.user.email;

const currentUserName = (state: ApplicationState): string =>
  state.auth.user.name;

const currentUserId = (state: ApplicationState): string => state.auth.user.id;

const currentUserGroups = (state: ApplicationState): Group[] =>
  state.auth.user.groups || [];

const currentEmployeeId = (state: ApplicationState): string =>
  state.auth.user.employeeId;

const currentEmployeeAvatar = (state: ApplicationState): Nullable<string> =>
  state.auth.user.avatar;

const getLoadPermissionsAsyncState = (state: ApplicationState): AsyncState =>
  state.auth.loadGroupsAsyncInfo;

const getHasTag = createSelector(
  (state: ApplicationState) => state.auth.groups.tags,
  (state: ApplicationState, selectedTag: GroupTag) => selectedTag,
  (tags, selectedTag) => tags.includes(selectedTag),
);

const employees = (state: ApplicationState) => state.auth.user.employees;

const hasMultipleCompanies = (state: ApplicationState): boolean =>
  state.auth.user.employees.length > 1;

const getCurrentUserGroups = createSelector(
  [currentUserGroups],
  (groups): OptionType[] => {
    return groups.map((group) => ({
      value: group.id,
      label: group.name,
    }));
  },
);

export default {
  isAuthenticated,
  currentUserEmail,
  currentUserName,
  currentUserId,
  currentEmployeeId,
  getLoadPermissionsAsyncState,
  employees,
  hasMultipleCompanies,
  getHasTag,
  currentEmployeeAvatar,
  getCurrentUserGroups,
};
