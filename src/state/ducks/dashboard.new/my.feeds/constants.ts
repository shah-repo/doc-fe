/* eslint-disable @typescript-eslint/camelcase */
export const MY_FEEDS_LIST = "dashboard/MY_FEEDS_LIST";
export const MY_FEEDS_LIST_ASYNC = "dashboard/MY_FEEDS_LIST_ASYNC";
export const DASHBOARD_MY_FEEDS_URL_SEARCH = "/dashboard_feed/search";
export const MY_FEEDS_INITIAL_OFFSET = 0;
export const MY_FEEDS_LIMIT = 50;
export const  MY_FEEDS_INITIAL_PAYLOAD = {
  offset: MY_FEEDS_INITIAL_OFFSET,
  limit: MY_FEEDS_LIMIT,
};
export const MY_FEEDS_LIST_INITIAL_STATE = {
  results: [],
  page_total: 0,
  total: 0,
};
