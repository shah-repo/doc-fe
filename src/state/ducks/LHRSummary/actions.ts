import {
  LHRSummaryItem,
  LHRSummaryOptionsResponse,
  LHRSummaryRequestBody,
} from '../../../ui/form.builder/FBLHRSummary/types';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import {
  CREATE_LHR_SUMMARY, ROOT_LHR_SUMMARY,
  UPDATE_LHR_SUMMARY,
} from './constants';

const fetchLHRSummary = (lhrDocRevId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${ROOT_LHR_SUMMARY}/${lhrDocRevId}`,
    method: 'get',
    handlers,
  });

const fetchLHRSummaryDataByOptionId = (
  searchText: string,
  optionId: string,
  offset: string,
  handlers: Handlers,
): ApiAction<LHRSummaryOptionsResponse> =>
  apiActionWithCallbacks({
    url: `${ROOT_LHR_SUMMARY}/search?optionId=${optionId}&searchQuery=${searchText}&offset=${offset}&limit=25`,
    method: 'get',
    handlers,
  });

const addLHRSummary = (
  data: LHRSummaryRequestBody,
  handlers: Handlers,
): ApiAction<LHRSummaryItem, LHRSummaryRequestBody> =>
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

const deleteLHRSummary = (
  lhrDocRevId: string,
  lhrSummaryId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${ROOT_LHR_SUMMARY}/${lhrDocRevId}/${lhrSummaryId}`,
    method: 'delete',
    handlers,
  });

export default {
  fetchLHRSummary,
  fetchLHRSummaryDataByOptionId,
  addLHRSummary,
  updateLHRSummary,
  deleteLHRSummary,
};
