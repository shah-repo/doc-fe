import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { MATERIAL_DISPOSITION_REVISIONS, MATERIAL_DISPOSITION_ROOT_URL } from './constants';

const loadMaterialDispositionList = (id: string, handlers: Handlers): ApiAction => apiActionWithCallbacks({
  url: `${MATERIAL_DISPOSITION_ROOT_URL}/${id}`,
  method: 'get',
  handlers,
});

const updateMDItem = (
  id: string,
  materialDispositionId: string,
  data,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${MATERIAL_DISPOSITION_ROOT_URL}/${id}/${materialDispositionId}`,
    method: 'patch',
    data: { ...data },
    handlers,
  });

const getMaterialDispositionRevisions = (id: string, handlers: Handlers): ApiAction => apiActionWithCallbacks({
  url: `${MATERIAL_DISPOSITION_REVISIONS}/${id}`,
  method: 'get',
  handlers,
});

export default {
  loadMaterialDispositionList,
  updateMDItem,
  getMaterialDispositionRevisions,
};
