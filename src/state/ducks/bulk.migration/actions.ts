import { IApprovalRequirements } from '../../../ui/administration/bulkMigration/interface';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { ADD_USER_GROUPS, LOAD_APPROVAL_REQUIREMENTS } from './constants';

const fetchApprovalRequirements = (toDocumentTypeId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `/${LOAD_APPROVAL_REQUIREMENTS}/${toDocumentTypeId}`,
    method: 'get',
    handlers,
  });

const addUserToGroups = (toDocumentTypeId: string, approvalRequirements: IApprovalRequirements, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `/${ADD_USER_GROUPS}/${toDocumentTypeId}`,
    method: 'patch',
    data: {
      missingGroups: approvalRequirements?.missingGroups,
    },
    handlers,
  });

export default {
  fetchApprovalRequirements,
  addUserToGroups,
};
