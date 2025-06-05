import { APPROVALS_ROOT_URL } from '.';
import { FBApprovalsStatusEndpoint } from '../../../ui/form.builder';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';

const applyTransition = (
  id: string,
  transition: FBApprovalsStatusEndpoint,
  handlers: Handlers<any>,
  password?: string,
  asyncType?: string,
  ignoreWarning = false,
): ApiAction<any, any> => apiActionWithCallbacks({
  url: `${APPROVALS_ROOT_URL}/${id}/${transition}?ignoreWarning=${ignoreWarning}`,
  method: 'post',
  password,
  handlers,
  asyncType,
});

export default {
  applyTransition,
};
