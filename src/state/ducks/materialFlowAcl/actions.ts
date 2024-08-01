import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { MATERIAL_FLOW_ACL_ROOT_URL } from './constants';
import { MaterialFlowAclRulePayload } from './types';

const getRules = (handlers: Handlers): ApiAction => apiActionWithCallbacks({
  url: MATERIAL_FLOW_ACL_ROOT_URL,
  method: 'get',
  handlers,
});

const addRule = (payload: MaterialFlowAclRulePayload, handlers: Handlers): ApiAction => apiActionWithCallbacks({
  url: MATERIAL_FLOW_ACL_ROOT_URL,
  method: 'post',
  data: payload,
  handlers,
});

const updateRule = (id: string, payload: MaterialFlowAclRulePayload, handlers: Handlers): ApiAction => apiActionWithCallbacks({
  url: `${MATERIAL_FLOW_ACL_ROOT_URL}/${id}`,
  method: 'put',
  data: payload,
  handlers,
});

const deleteRule = (id: string, handlers: Handlers): ApiAction => apiActionWithCallbacks({
  url: `${MATERIAL_FLOW_ACL_ROOT_URL}/${id}`,
  method: 'delete',
  handlers,
});

export default {
  getRules,
  addRule,
  updateRule,
  deleteRule,
};
