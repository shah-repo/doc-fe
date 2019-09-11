import { ApiAction, Handlers } from "../../types";
import { apiActionWithCallbacks } from "../../factories";

const getChanges = (auditId: string, handlers: Handlers):
  ApiAction => apiActionWithCallbacks({
      url: "/status",
      method: "get",
      handlers,
    });

export default {
  getChanges,
}