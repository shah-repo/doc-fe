import { FBEndpoint } from '../../../ui/form.builder/defaults/FBEndpoint';
import { apiActionWithCallbacks } from '../../factories';
import { Handlers } from '../../types';

  const postPrintLotLabelAsyncTask = (params: Object, handlers: Handlers) => apiActionWithCallbacks({
    url: FBEndpoint.PrintLotLabels,
    method: 'post',
    data: params,
    handlers,
  });

  const postPrintEquipmentLabelAsyncTask = (params: Object, handlers: Handlers) => apiActionWithCallbacks({
    url: FBEndpoint.PrintEquipmentLabels,
    method: 'post',
    data: params,
    handlers,
  });

  export default {
    postPrintLotLabelAsyncTask,
    postPrintEquipmentLabelAsyncTask,
  };
