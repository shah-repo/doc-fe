import { MaterialDispositionItem, MDItemEditRequestBody } from '../../../ui/change.request/FBMaterialDisposition/components/FBMaterialDispositionTable/types';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { MATERIAL_DISPOSITION_ALL_DOCS_LIST, MATERIAL_DISPOSITION_ROOT_URL } from './constants';

const loadMaterialDispositionList = (id: string, handlers: Handlers): ApiAction<MaterialDispositionItem[]> => apiActionWithCallbacks({
  url: `${MATERIAL_DISPOSITION_ROOT_URL}/${id}`,
  method: 'get',
  handlers,
});

const loadAllDocsList = (
  offset: string,
  searchText: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${MATERIAL_DISPOSITION_ALL_DOCS_LIST}?searchQuery=${searchText}&offset=${offset}&limit=25`,
    method: 'get',
    handlers,
  });

const updateMDItem = (
  id: string,
  data: MDItemEditRequestBody,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${MATERIAL_DISPOSITION_ROOT_URL}/${id}`,
    method: 'patch',
    data,
    handlers,
  });

const addMDItem = (
  id: string,
  data: MDItemEditRequestBody,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${MATERIAL_DISPOSITION_ROOT_URL}/${id}`,
    method: 'post',
    data,
    handlers,
  });

const deleteMDItem = (arId: string, materialDispositionId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${MATERIAL_DISPOSITION_ROOT_URL}/${arId}/${materialDispositionId}`,
    method: 'delete',
    handlers,
  });

export default {
  loadMaterialDispositionList,
  updateMDItem,
  addMDItem,
  deleteMDItem,
  loadAllDocsList,
};
