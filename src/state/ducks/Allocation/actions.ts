import { AllocationLOTBody, AllocationPartBody } from '../../../ui/form.builder/FBAllocation/components/treelist/interface';
import { AllocationItem } from '../../../ui/form.builder/FBAllocation/interface';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { ALLOCATION_LIST_ROOT_URL } from './constants';

const loadAllocationList = (
  woId: string,
  woPartRevId: string,
  handlers: Handlers,
): ApiAction<AllocationItem[]> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}/${woId}/workOrderPartRev/${woPartRevId}`,
    method: 'get',
    handlers,
  });

const addPart = (
  data: AllocationPartBody,
  handlers: Handlers,
): ApiAction<any[]> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}`,
    method: 'post',
    data: data,
    handlers,
  });

const addLot = (
  data: AllocationLOTBody,
  handlers: Handlers,
): ApiAction<any[]> =>
  apiActionWithCallbacks({
    url: `${ALLOCATION_LIST_ROOT_URL}`,
    method: 'post',
    data: data,
    handlers,
  });

export default {
  loadAllocationList,
  addPart,
  addLot,
};
