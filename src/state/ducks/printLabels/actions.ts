import { FBEndpoint } from '../../../ui/form.builder/defaults/FBEndpoint';
import { apiActionWithCallbacks } from '../../factories';
import { Handlers } from '../../types';

  const postPrintLabelAsyncTask = (params: Object, handlers: Handlers) => apiActionWithCallbacks({
    url: FBEndpoint.PrintLabels,
    method: 'post',
    data: params,
    handlers,
  });

  export default {
    postPrintLabelAsyncTask,
  };
