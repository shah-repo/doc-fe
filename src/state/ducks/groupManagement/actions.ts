import { GroupRequestBody } from ".";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { authActions } from "../auth";
import { GROUPS_URL, userManagementActions } from "../userManagement";

const createGroup = (
  body: GroupRequestBody,
  handlers: Handlers,
): ApiAction<GroupRequestBody> =>
  apiActionWithCallbacks({
    url: GROUPS_URL,
    method: "post",
    data: body,
    onSuccess: ((res, dispatch) => {
      dispatch(userManagementActions.loadCompanyGroups());
    } ),
    handlers,
  });

const editGroup = (
  groupId: string,
  body: GroupRequestBody,
  handlers: Handlers,
): ApiAction<GroupRequestBody> =>
  apiActionWithCallbacks({
    url: `${GROUPS_URL}/${groupId}`,
    method: "patch",
    data: body,
    onSuccess: ((res, dispatch) => {
      dispatch(userManagementActions.loadCompanyGroups());
      dispatch(authActions.loadUserGroups());
    } ),
    handlers,
  });

export default {
  createGroup,
  editGroup,
};
