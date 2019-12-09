import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { COMPANY_GROUPS_GET_ASYNC, GROUPS_URL } from "./constants";
import { LoadCompanyGroups } from "./types";

const loadCompanyGroups = (handlers: Handlers): ApiAction<LoadCompanyGroups> =>
  apiActionWithCallbacks({
    url: `${GROUPS_URL}`,
    asyncType: COMPANY_GROUPS_GET_ASYNC,
    method: "get",
    handlers,
  });

export default {
  loadCompanyGroups,
};
