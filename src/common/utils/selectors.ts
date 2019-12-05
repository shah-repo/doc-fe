import { tableSearchSelectors } from "../../state/ducks/tableSearch";
import { ApplicationState } from "../../state/reducers";
import { GroupTag } from "../../state/ducks/auth/types";
import { authSelectors } from "../../state/ducks/auth";

export const getTableState = (tableName: string) => (reduxState: ApplicationState) => tableSearchSelectors.getTableState(reduxState, tableName);
export const getHasTag = (tag: GroupTag) => (reduxState: ApplicationState) => authSelectors.getHasTag(reduxState, tag);
