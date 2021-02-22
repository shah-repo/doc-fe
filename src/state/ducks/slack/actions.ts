import { URL_OAUTH_TYPES } from ".";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";

const postSlackCode = (
  url: URL_OAUTH_TYPES,
  params: any,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${url}`,
    method: "get",
    params,
    handlers,
  });

export default {
  postSlackCode,
};
