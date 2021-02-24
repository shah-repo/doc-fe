import { authSelectors } from "../../state/ducks/auth";
import { Permission } from "../../state/ducks/auth/types";
import { tableSearchSelectors } from "../../state/ducks/tableSearch";
import { ApplicationState } from "../../state/reducers";

export const getTableCriteria = (tableName: string) => (reduxState: ApplicationState) => tableSearchSelectors.getTableCriteria(reduxState, tableName);
export const getTableData = (tableName: string) => (reduxState: ApplicationState) => tableSearchSelectors.getTableData(reduxState, tableName);
export const getHasSlack = (slack: Permission) => (reduxState: ApplicationState) => authSelectors.getHasSlack(reduxState, slack);
export const getHasPermission = (permission: Permission) => (reduxState: ApplicationState) => authSelectors.getHasPermission(reduxState, permission);
export const getCurrentUserTags = () => (reduxState: ApplicationState) => authSelectors.currentEmployeeTags(reduxState);
