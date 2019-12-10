import { authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { tableSearchSelectors } from "../../state/ducks/tableSearch";
import { ApplicationState } from "../../state/reducers";

export const getTableState = (tableName: string) => (reduxState: ApplicationState) => tableSearchSelectors.getTableState(reduxState, tableName);
export const getHasTag = (tag: GroupTag) => (reduxState: ApplicationState) => authSelectors.getHasTag(reduxState, tag);
