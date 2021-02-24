import { createSelector } from "reselect";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { Nullable } from "../common/types";
import { Group, GroupTag, IotCredentials, Permission } from "./types";

const isAuthenticated = (state: ApplicationState): boolean =>
  Boolean(state.auth.user.sessionId && state.auth.user.employeeId);

const currentUserEmail = (state: ApplicationState): string =>
  state.auth.user.email;

const currentUserName = (state: ApplicationState): string =>
  state.auth.user.name;

const currentUserId = (state: ApplicationState): string => state.auth.user.id;

const getExpirationOfCredentials = (state: ApplicationState): string =>
  state.auth.user.iotCredentials.credentials.Expiration;

const getCredentials = (state: ApplicationState): IotCredentials =>
  state.auth.user.iotCredentials;

const currentUserGroups = (state: ApplicationState): Group[] =>
  state.auth.user.groups || [];

const currentEmployeeId = (state: ApplicationState): string =>
  state.auth.user.employeeId;

const isCustomLabelsOn = (state: ApplicationState): boolean =>
  state.auth.user.customLabels;

const currentSlackUserId = (state: ApplicationState): string =>
  state.auth.user.employee.slackUserId;

const currentUserActiveStatus = (state: ApplicationState): boolean =>
  state.auth.user.employee.active;

const currentEmployeeAvatar = (state: ApplicationState): Nullable<string> =>
  state.auth.user.avatar;

const currentEmployeePermissions = (state: ApplicationState): Permission[] =>
  state.auth.groups.permissions;

const currentEmployeeTags = (state: ApplicationState): GroupTag[] =>
  state.auth.groups.tags;

const getLoadPermissionsAsyncState = (state: ApplicationState): AsyncState =>
  state.auth.loadGroupsAsyncInfo;

const getPingServerAsyncState = (state: ApplicationState): AsyncState =>
  state.auth.pingServerAsyncInfo;

const makeGetHasTag = () => createSelector(
  (state: ApplicationState) => state.auth.groups.tags,
  (state: ApplicationState, selectedTag: GroupTag) => selectedTag,
  (tags, selectedTag) => tags.includes(selectedTag),
);

const getHasSlack = createSelector(
  (state: ApplicationState) => state.auth.groups.permissions,
  (state: ApplicationState, selectedTag: Permission) => selectedTag,
  (tags, selectedTag) => tags.includes(selectedTag),
);

const employees = (state: ApplicationState) => state.auth.user.employees;

const hasMultipleCompanies = (state: ApplicationState): boolean => (
  ((state.auth.user.employees).filter((employee) => employee.active)).length > 1
);

const getCurrentUserGroups = createSelector(
  [currentUserGroups],
  (groups): OptionType[] => (groups || []).map((group) => ({
    value: group.id,
    label: group.name,
  })),
);

const makeGetHasPermission = () => createSelector(
  (state: ApplicationState) => state.auth.groups.permissions,
  (state: ApplicationState, selectedPermission: Permission) =>
    selectedPermission,
  (permissions, selectedPermission) => permissions.includes(selectedPermission),
);

const getHasPermission = createSelector(
  (state: ApplicationState) => state.auth.groups.permissions,
  (state: ApplicationState, selectedPermission: Permission) =>
    selectedPermission,
  (permissions, selectedPermission) => permissions.includes(selectedPermission),
);

export default {
  isAuthenticated,
  currentUserEmail,
  currentUserName,
  currentUserId,
  currentEmployeeId,
  getLoadPermissionsAsyncState,
  getPingServerAsyncState,
  employees,
  hasMultipleCompanies,
  currentEmployeeAvatar,
  getHasSlack,
  getCurrentUserGroups,
  currentSlackUserId,
  currentUserGroups,
  currentUserActiveStatus,
  getHasPermission,
  currentEmployeePermissions,
  currentEmployeeTags,
  makeGetHasTag,
  makeGetHasPermission,
  getExpirationOfCredentials,
  getCredentials,
  isCustomLabelsOn,
};
