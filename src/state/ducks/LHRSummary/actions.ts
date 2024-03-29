import { LHRSummaryItem, LHRSummaryRequestBody } from '../../../ui/form.builder/FBLHRSummary/types';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { CREATE_LHR_SUMMARY, FETCH_AUTOCOMPLETE_OPTIONS, ROOT_LHR_SUMMARY, UPDATE_LHR_SUMMARY } from './constants';

const fetchLHRSummary = (lhrDocRevId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${ROOT_LHR_SUMMARY}/${lhrDocRevId}`,
    method: 'get',
    handlers,
  });

const fetchAutocompleteOptions = (optionId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${FETCH_AUTOCOMPLETE_OPTIONS}/${optionId}`,
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
  lhrDocRevId: string,
  lhrSummaryId: string,
  data: LHRSummaryRequestBody,
  handlers: Handlers,
): ApiAction<LHRSummaryItem, LHRSummaryRequestBody> =>
  apiActionWithCallbacks({
    url: `${UPDATE_LHR_SUMMARY}/${lhrDocRevId}/${lhrSummaryId}/update`,
    method: 'patch',
    data,
    handlers,
  });

const deleteLHRSummary = (lhrDocRevId: string, lhrSummaryId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${ROOT_LHR_SUMMARY}/${lhrDocRevId}/${lhrSummaryId}`,
    method: 'delete',
    handlers,
  });

export default {
  fetchLHRSummary,
  fetchAutocompleteOptions,
  addLHRSummary,
  updateLHRSummary,
  deleteLHRSummary,
};
