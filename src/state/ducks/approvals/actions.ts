import { FBApprovalsStatusEndpoint } from "../../../ui/form.builder/FBApprovals";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { APPROVALS_ROOT_URL } from "./constants";

const applyTransition = (
  id: string,
  transition: FBApprovalsStatusEndpoint,
  handlers: Handlers<any>,
): ApiAction<any, any> => apiActionWithCallbacks({
  url: `${APPROVALS_ROOT_URL}/${id}/${transition}`,
  method: "post",
  handlers,
});

export default {
  applyTransition,
};
