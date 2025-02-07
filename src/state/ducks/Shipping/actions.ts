import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { DocumentRevision } from '../documentRevisions/types';
import { LATEST_SHIPPING_CUSTOMER_INFO } from './constants';

const fetchLatestRevisionDetailsByRevId = (
  revId: string,
  handlers: Handlers,
): ApiAction<DocumentRevision[]> =>
  apiActionWithCallbacks({
    url: `${LATEST_SHIPPING_CUSTOMER_INFO}/${revId}`,
    method: 'get',
    handlers,
  });

export default {
  fetchLatestRevisionDetailsByRevId,
};
