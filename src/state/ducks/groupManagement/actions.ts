import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { GROUPS_URL } from "../userManagement/constants";
import { GroupRequestBody } from "./types";

const createGroup = (
    body: GroupRequestBody,
    handlers: Handlers,
  ): ApiAction<GroupRequestBody> =>
    apiActionWithCallbacks({
      url: GROUPS_URL,
      method: "post",
      data: body,
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
      handlers,
    });

export default {
  createGroup,
  editGroup,
};
