import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { GroupTag } from "./types";

const isAuthenticated = (state: ApplicationState): boolean => {
  return Boolean(state.auth.user.sessionId && state.auth.user.employeeId);
};

const currentUserEmail = (state: ApplicationState): string =>
  state.auth.user.email;

const currentUserName = (state: ApplicationState): string =>
  state.auth.user.name;

const currentUserId = (state: ApplicationState): string => state.auth.user.id;

const currentEmployeeId = (state: ApplicationState): string =>
  state.auth.user.employeeId;

const currentEmployeeAvatar = (state: ApplicationState): string | null =>
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
};
