import { authSelectors } from "../../state/ducks/auth";
import { GroupTag, Permission } from "../../state/ducks/auth/types";
import { tableSearchSelectors } from "../../state/ducks/tableSearch";
import { ApplicationState } from "../../state/reducers";

export const getTableState = (tableName: string) => (reduxState: ApplicationState) => tableSearchSelectors.getTableState(reduxState, tableName);
export const getHasTag = (tag: GroupTag) => (reduxState: ApplicationState) => authSelectors.getHasTag(reduxState, tag);
export const getHasSlack = (slack: Permission) => (reduxState: ApplicationState) => authSelectors.getHasSlack(reduxState, slack);
export const getHasPermission = (permission: Permission) => (reduxState: ApplicationState) => authSelectors.getHasPermission(reduxState, permission);
