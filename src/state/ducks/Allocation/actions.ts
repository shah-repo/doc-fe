import { ValidateLot } from '../../../ui/components/common/dialogs/scaner/components/lot.table/types';
import { AllocationLOTBody, AllocationPartBody } from '../../../ui/form.builder/FBAllocation/components/treelist/interface';
import { AllocationItem, LatestPartRevisionInfo } from '../../../ui/form.builder/FBAllocation/interface';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { DocumentRevision } from '../documentRevisions/types';
import { ALLOCATION_LIST_ROOT_URL, LATEST_CUSTOMER_REVISION_URL, LATEST_PART_REVISION_URL, VALIDATE_EQ_SCAN, VALIDATE_SCANNED_LOT } from './constants';

const loadAllocationList = (
  woId: string,
  handlers: Handlers,
): ApiAction<AllocationItem[]> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}`,
    method: 'get',
    handlers,
  });

const autoAssignLOT = (
  woId: string,
  handlers: Handlers,
): ApiAction<AllocationItem[]> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}/autoAssign`,
    method: 'get',
    handlers,
  });

const addPart = (
  data: AllocationPartBody,
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}`,
    method: 'post',
    data: {
      allocations: data,
    },
    handlers,
  });

const updatePart = (
  woId: string,
  partRevId: string,
  isAutoAssigned: boolean,
  data: AllocationPartBody,
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiAction({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}/parts/${partRevId}`,
    method: 'patch',
    data: data,
    onSuccess: (unknown, dispatch) => {
      if (isAutoAssigned) {
        dispatch(autoAssignLOT(woId, handlers));
      } else {
        handlers.successHandler.execute(null);
      }
    },
    onFailure: handlers.errorHandler.execute,
  });

const addLot = (
  data: AllocationLOTBody[],
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}`,
    method: 'post',
    data: {
      allocations: data,
    },
    handlers,
  });

const deleteLot = (
  woId: string,
  partRevId: string,
  lotRevId: string,
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}/parts/${partRevId}/lots/${lotRevId}`,
    method: 'delete',
    handlers,
  });

const deletePart = (
  woId: string,
  partRevId: string,
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}/parts/${partRevId}`,
    method: 'delete',
    handlers,
  });

const deleteAllocation = (
  woId: string,
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}`,
    method: 'delete',
    handlers,
  });

const fetchLatestPartRevision = (
  partRevId: string,
  handlers: Handlers,
): ApiAction<LatestPartRevisionInfo> =>
  apiActionWithCallbacks({
    url: `${LATEST_PART_REVISION_URL}/${partRevId}`,
    method: 'get',
    handlers,
  });

const fetchLatestRevisionDetailsByRevId = (
  revId: string,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${LATEST_CUSTOMER_REVISION_URL}/${revId}`,
    method: 'get',
    handlers,
  });

const validateScannedLot = (
  parentRevId: string,
  partRevId: string,
  lotRevId: string,
  handlers: Handlers,
): ApiAction<ValidateLot> =>
  apiActionWithCallbacks({
    url: `${VALIDATE_SCANNED_LOT}/${parentRevId}/parts/${partRevId}/lots/${lotRevId}/validate`,
    method: 'get',
    handlers,
  });

const validateEQScannedItem = (
  equipmentRevId: string,
  handlers: Handlers,
): ApiAction<ValidateLot> =>
  apiActionWithCallbacks({
    url: `${VALIDATE_EQ_SCAN}/${equipmentRevId}/validate`,
    method: 'get',
    handlers,
  });

export default {
  fetchLatestRevisionDetailsByRevId,
  loadAllocationList,
  autoAssignLOT,
  addPart,
  addLot,
  updatePart,
  deleteLot,
  fetchLatestPartRevision,
  deletePart,
  deleteAllocation,
  validateScannedLot,
  validateEQScannedItem,
};
