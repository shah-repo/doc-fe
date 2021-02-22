import { DASHBOARD_ROOT_URL, PendingAction, PendingActionsListAction, PendingActionsRemoveAction, PENDING_ACTIONS_LIST, PENDING_ACTIONS_LIST_ASYNC, PENDING_ACTIONS_REMOVE } from ".";
import { apiAction } from "../../factories";
import { ApiAction } from "../../types";

const pendingActionsList = (pendingActions: PendingAction[]): PendingActionsListAction => ({
  type: PENDING_ACTIONS_LIST,
  payload: pendingActions,
});

const loadPendingActionsList = (): ApiAction<PendingAction[]> => apiAction({
  url: `${DASHBOARD_ROOT_URL}`,
  method: "get",
  asyncType: PENDING_ACTIONS_LIST_ASYNC,
  onSuccess: (pendingActions, dispatch) => {
    dispatch(pendingActionsList(pendingActions));
  },
});

const removeFromList = (index: number): PendingActionsRemoveAction => ({
  type: PENDING_ACTIONS_REMOVE,
  payload: index,
});

export default {
  pendingActionsList,
  loadPendingActionsList,
  removeFromList,
};
