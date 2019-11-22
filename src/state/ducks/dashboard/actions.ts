import { apiAction } from "../../factories";
import { ApiAction } from "../../types";
import {
  DASHBOARD_ROOT_URL,
  PENDING_ACTIONS_LIST,
  PENDING_ACTIONS_LIST_ASYNC,
} from "./constants";
import {
  PendingAction,
  PendingActionsListAction,
} from "./types";

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

export default {
  pendingActionsList,
  loadPendingActionsList,
};
