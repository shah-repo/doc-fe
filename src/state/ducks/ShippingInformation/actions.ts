import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { DocumentRevision } from '../documentRevisions/types';
import {
  FETCH_ADDRESSES,
} from './constants';

const fetchAddressesByCustomerId = (
  customerId: string,
  optionId: string,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${FETCH_ADDRESSES}/${customerId}/${optionId}`,
    method: 'get',
    handlers,
  });

export default {
  fetchAddressesByCustomerId,
};
