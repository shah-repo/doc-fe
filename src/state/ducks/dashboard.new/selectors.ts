import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const recents = (state: ApplicationState) =>
  state.dashboardNew.recents;

const getLoadRecentsListAsyncInfo = (
  state: ApplicationState,
): AsyncState => state.dashboardNew.loadRecentsListAsyncInfo;

export default {
  getLoadRecentsListAsyncInfo,
  recents,
};
