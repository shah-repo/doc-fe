import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { PO_ROOT_URL } from './constants';

const validatePO = (
  poId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${PO_ROOT_URL}/${poId}/validate`,
    method: 'get',
    handlers,
  });

export default {
  validatePO,
};
