import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { Group } from "../auth/types";
import {
  COMPANY_GROUPS_GET_ASYNC,
  GROUPS_ME_GET_ASYNC,
  GROUPS_ME_URL,
  GROUPS_URL,
} from "./constants";
import { LoadCompanyGroups } from "./types";

const loadCompanyGroups = (handlers: Handlers): ApiAction<LoadCompanyGroups> =>
  apiActionWithCallbacks({
    url: `${GROUPS_URL}`,
    asyncType: COMPANY_GROUPS_GET_ASYNC,
    method: "get",
    handlers,
  });

const loadGroupsMe = (handlers: Handlers): ApiAction<Group[]> =>
  apiActionWithCallbacks({
    url: `${GROUPS_ME_URL}`,
    asyncType: GROUPS_ME_GET_ASYNC,
    method: "get",
    handlers,
  });

export default {
  loadCompanyGroups,
  loadGroupsMe,
};
