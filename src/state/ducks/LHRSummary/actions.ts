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
import { DocumentRevision, DocumentRevisionStatus } from '../documentRevisions/types';
import {
  CREATE_LHR_SUMMARY, FETCH_LOTS, ROOT_LHR_SUMMARY,
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
    url: `${ROOT_LHR_SUMMARY}/search?optionId=${optionId}&searchQuery=${searchText}&offset=${offset}&limit=${LIMIT}`,
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
      status: [DocumentRevisionStatus.Released, DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange, DocumentRevisionStatus.InReview, DocumentRevisionStatus.Approved],
      limit: LIMIT,
      offset: offset,
      filters: [
        { field: 'document.docId', operator: KendoGridFilterCellOperators.CONTAINS, value: searchStr },
        { field: 'issue.name', operator: KendoGridFilterCellOperators.CONTAINS, value: searchStr },
      ],
      sort: [],
      schema: [
        {
          displayStatus: true,
          document: { docId: true, id: true },
          precalc: { revision: true },
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

const fetchLotsByPartId = (
  partId: string,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${FETCH_LOTS}/${partId}`,
    method: 'get',
    handlers,
  });

export default {
  fetchLHRSummary,
  fetchLHRSummaryDataByOptionId,
  addLHRSummary,
  fetchRecords,
  updateLHRSummary,
  deleteLHRSummary,
  fetchLotsByPartId,
};
