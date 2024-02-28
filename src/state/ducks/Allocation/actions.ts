import { AllocationLOTBody, AllocationPartBody } from '../../../ui/form.builder/FBAllocation/components/treelist/interface';
import { AllocationItem } from '../../../ui/form.builder/FBAllocation/interface';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { ALLOCATION_LIST_ROOT_URL } from './constants';

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
    data: data,
    handlers,
  });

const updatePart = (
  woId: string,
  partRevId: string,
  data: AllocationPartBody,
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}/entry/${partRevId}`,
    method: 'patch',
    data: data,
    handlers,
  });

const addLot = (
  data: AllocationLOTBody,
  handlers: Handlers,
): ApiAction<AllocationItem> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}`,
    method: 'post',
    data: data,
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

export default {
  loadAllocationList,
  autoAssignLOT,
  addPart,
  addLot,
  updatePart,
  deleteLot,
  deletePart,
};
