import { APPROVALS_ROOT_URL } from '.';
import { FBInlineApprovalTransition } from '../../../ui/form.builder';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, ApiActionMethod, Handlers } from '../../types';

const applyTransition = (
  id: string,
  transition: FBInlineApprovalTransition,
  handlers: Handlers<any>,
  body?: string,
  password?: string,
  asyncType?: string,
  ignoreWarning = false,
): ApiAction<any, any> => {
  const defaultObj = {
    url: `${APPROVALS_ROOT_URL}/${id}/${transition}?ignoreWarning=${ignoreWarning}`,
    method: 'post' as ApiActionMethod,
    handlers,
    asyncType,
  };
  if (body) {
    Object.assign(defaultObj, {
      data: body,
    });
  }

  if (password) {
    Object.assign(defaultObj, {
      password,
    });
  }
  return apiActionWithCallbacks(defaultObj);
};

export default {
  applyTransition,
};
