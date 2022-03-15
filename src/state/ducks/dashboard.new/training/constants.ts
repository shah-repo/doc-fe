/* eslint-disable @typescript-eslint/camelcase */
export const TRAINING_LIST = "dashboard/TRAINING_LIST";
export const TRAINING_LIST_ASYNC = "dashboard/TRAINING_LIST_ASYNC";
export const TRAINING_URL = "/dashboard_feed/due_trainings";
export const TRAINING_INITIAL_OFFSET = 0;
export const TRAINING_LIMIT = 50;
export const  TRAINING_INITIAL_PAYLOAD = {
  offset: TRAINING_INITIAL_OFFSET,
  limit: TRAINING_LIMIT,
};
export const TRAINING_LIST_INITIAL_STATE = {
  results: [],
  page_total: 0,
  total: 0,
};
