import { KendoGridFilterCellOperators } from '../../../ui/components/KendoGrid/interfaces';
import { LIMIT } from '../../../ui/form.builder/FBLHRSummary/constants';
import {
  LHRSummaryItem,
  LHRSummaryOptionsResponse,
  LHRSummaryRequestBody,
} from '../../../ui/form.builder/FBLHRSummary/types';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from '../documentRevisions/constants';
import { DocumentRevisionStatus } from '../documentRevisions/types';
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

const fetchRecords = (
  searchStr,
  offset = 0,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: DOCUMENT_REVISION_SEARCH_ROOT_URL,
    method: 'post',
    data: {
      documentTypeCategory: 'Record',
      status: [DocumentRevisionStatus.Released],
      limit: LIMIT,
      offset: offset,
      filters: [
        { field: 'document.docId', operator: KendoGridFilterCellOperators.CONTAINS, value: searchStr },
        { field: 'displayStatus', operator: KendoGridFilterCellOperators.EQ, value: 'Released' },
      ],
      sort: [],
      schema: [
        {
          displayStatus: true,
          document: { docId: true, id: true },
          id: true,
          name: true,
        },
      ],
    },
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
  fetchRecords,
  updateLHRSummary,
  deleteLHRSummary,
};
