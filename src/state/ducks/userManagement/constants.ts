/* eslint-disable @typescript-eslint/camelcase */
export const COMPANY_GROUPS_LIST = "userManagement/COMPANY_GROUPS_LIST";
export const COMPANY_GROUPS_GET_ASYNC = "userManagement/COMPANY_GROUPS_GET_ASYNC";
export const GROUPS_ME_GET_ASYNC = "userManagement/GROUPS_ME_GET_ASYNC";
export const GROUP_GET_BY_ID = "userManagement/GROUPS_GET_BY_ID";
export const ADD_EMPLOYEE_POST_ASYNC = "userManagement/ADD_EMPLOYEE_POST_ASYNC";
export const EMPLOYEE_GET_ASYNC = "userManagement/EMPLOYEE_GET_ASYNC";
export const API_TOKEN_POST_ASYNC = "userManagement/API_TOKEN_POST_ASYNC";
export const API_TOKEN_GET_ASYNC = "userManagement/API_TOKEN_GET_ASYNC";
export const API_TOKEN_DELETE_ASYNC = "userManagement/API_TOKEN_DELETE_ASYNC";

export const SLACK_URL = "userManagement/SLACK_URL";
export const EMPLOYEES_URL = "/employees";
export const GROUPS_URL = "/groups";
export const GROUPS_ME_URL = `${GROUPS_URL}/me`;

export const COMPANY_SLACK_URL = "/slack/company_oauth_url";
export const USER_SLACK_URL = "/slack/user_oauth_url";

export const API_TOKEN = "/api_tokens";
export const API_TOKEN_URL = `${API_TOKEN}/generate`;
export const API_TOKEN_REVOKE_URL = `${API_TOKEN}/revoke`;

export const HISTORY_LIST = "userManagement/HISTORY_LIST";
export const HISTORY_LIST_ASYNC = "userManagement/HISTORY_LIST_ASYNC";

// TODO: Update with new API URL
export const HISTORY_URL = "/dashboard_feed/due_trainings";
export const HISTORY_INITIAL_OFFSET = 0;
export const HISTORY_LIMIT = 50;
export const  HISTORY_INITIAL_PAYLOAD = {
  offset: HISTORY_INITIAL_OFFSET,
  limit: HISTORY_LIMIT,
};
export const HISTORY_LIST_INITIAL_STATE = {
  results: [],
  page_total: 0,
  total: 0,
};
