import { MaterialDispositionItem, MDItemEditRequestBody } from '../../../ui/change.request/FBMaterialDisposition/components/FBMaterialDispositionTable/interface';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { MATERIAL_DISPOSITION_ROOT_URL } from './constants';

const loadMaterialDispositionList = (id: string, handlers: Handlers): ApiAction<MaterialDispositionItem[]> => apiActionWithCallbacks({
  url: `${MATERIAL_DISPOSITION_ROOT_URL}/${id}`,
  method: 'get',
  handlers,
});

const updateMDItem = (
  id: string,
  materialDispositionId: string,
  data: MDItemEditRequestBody,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${MATERIAL_DISPOSITION_ROOT_URL}/${id}/${materialDispositionId}`,
    method: 'patch',
    data: { ...data },
    handlers,
  });

export default {
  loadMaterialDispositionList,
  updateMDItem,
};
