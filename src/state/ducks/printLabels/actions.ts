import { FBEndpoint } from '../../../ui/form.builder/defaults/FBEndpoint';
import { apiActionWithCallbacks } from '../../factories';
import { Handlers } from '../../types';

const getDocumentRevisionAsyncTask = (id: string, handlers: Handlers) => apiActionWithCallbacks({
    url: `${FBEndpoint.DocumentRevisionsUrl}/${id}`,
    method: 'get',
    handlers,
  });

  const postPrintLabelAsyncTask = (params: Object, handlers: Handlers) => apiActionWithCallbacks({
    url: FBEndpoint.PrintLabels,
    method: 'post',
    data: JSON.parse(JSON.stringify(params)),
    handlers,
  });

  export default {
    getDocumentRevisionAsyncTask,
    postPrintLabelAsyncTask,
  };
