import { LHRSummaryItem, LHRSummaryRequestBody } from '../../../ui/form.builder/FBLHRSummary/types';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { CREATE_LHR_SUMMARY, FETCH_ALL_LHR_SUMMARY, ROOT_LHR_SUMMARY, UPDATE_LHR_SUMMARY } from './constants';

const fetchAllLHRSummary = (handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: FETCH_ALL_LHR_SUMMARY,
    method: 'get',
    handlers,
  });

const fetchLHRSummary = (lhrSummaryId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${ROOT_LHR_SUMMARY}/${lhrSummaryId}`,
    method: 'get',
    handlers,
  });

const addLHRSummary = (data: LHRSummaryRequestBody, handlers: Handlers): ApiAction<LHRSummaryItem, LHRSummaryRequestBody> =>
  apiActionWithCallbacks({
    url: CREATE_LHR_SUMMARY,
    method: 'post',
    data,
    handlers,
  });

const updateLHRSummary = (
  lhrSummaryId: string,
  data: LHRSummaryRequestBody,
  handlers: Handlers,
): ApiAction<LHRSummaryItem, LHRSummaryRequestBody> =>
  apiActionWithCallbacks({
    url: `${UPDATE_LHR_SUMMARY}/${lhrSummaryId}`,
    method: 'patch',
    data,
    handlers,
  });

const deleteLHRSummary = (lhrSummaryId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${ROOT_LHR_SUMMARY}/${lhrSummaryId}`,
    method: 'delete',
    handlers,
  });

export default {
  fetchAllLHRSummary,
  fetchLHRSummary,
  addLHRSummary,
  updateLHRSummary,
  deleteLHRSummary,
};
