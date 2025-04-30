import { IApprovalRequirements } from '../../../ui/administration/bulkMigration/interface';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { BULK_MIGRATION_ADD_USER_TO_GROUPS, BULK_MIGRATION_GET_APPROVAL_REQUIREMENTS } from './constants';

const fetchApprovalRequirements = (toDocumentTypeId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `/${BULK_MIGRATION_GET_APPROVAL_REQUIREMENTS}/${toDocumentTypeId}`,
    method: 'get',
    handlers,
  });

const addUserToGroups = (toDocumentTypeId: string, approvalRequirements: IApprovalRequirements, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `/${BULK_MIGRATION_ADD_USER_TO_GROUPS}/${toDocumentTypeId}`,
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
