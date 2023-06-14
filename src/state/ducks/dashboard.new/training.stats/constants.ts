export const TRAINING_STATS_LIST = 'dashboard/TRAINING_STATS_LIST';
export const TRAINING_STATS_LIST_ASYNC = 'dashboard/TRAINING_STATS_LIST_ASYNC';
export const TRAINING_STATS_URL = '/training_record/due';
export const TRAINING_STATS_CHART = 'dashboard/TRAINING_STATS_CHART';
export const TRAINING_STATS_CHART_ASYNC = 'dashboard/TRAINING_STATS_CHART_ASYNC';
export const TRAINING_STATS_CHART_URL = '/training_record/dueSummary';
export const TRAINING_STATS_INITIAL_OFFSET = 0;
export const TRAINING_STATS_LIMIT = 50;
export const TRAINING_STATS_INITIAL_PAYLOAD = {
  offset: TRAINING_STATS_INITIAL_OFFSET,
  limit: TRAINING_STATS_LIMIT,
  filters: [],
};
export const TRAINING_STATS_CHART_INITIAL_STATE = {
  DUE: 0,
  OVERDUE: 0,
};
export const TRAINING_STATS_LIST_INITIAL_STATE = {
  results: [],
  page_total: 0,
  total: 0,
};
