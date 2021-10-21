import { apiAction } from "../../factories";
import { ApiAction } from "../../types";
import { DASHBOARD_RECENT_URL, RECENTS_LIST, RECENTS_LIST_ASYNC, RECENTS_REMOVE } from "./constants";
import { Recent, RecentsListAction, RecentsRemoveAction } from "./types";

const pendingActionsList = (pendingActions: Recent[]): RecentsListAction => ({
  type: RECENTS_LIST,
  payload: pendingActions,
});

const loadRecentsList = (): ApiAction<Recent[]> => apiAction({
  url: `${DASHBOARD_RECENT_URL}`,
  method: "get",
  asyncType: RECENTS_LIST_ASYNC,
  onSuccess: (pendingActions, dispatch) => {
    dispatch(pendingActionsList(pendingActions));
  },
});

const removeFromList = (index: number): RecentsRemoveAction => ({
  type: RECENTS_REMOVE,
  payload: index,
});

export default {
  pendingActionsList,
  loadRecentsList,
  removeFromList,
};
