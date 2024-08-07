import { LotTransferType } from '../../../ui/form.builder/FBLotTransfers/types';
import { Group } from '../auth/types';

export interface MaterialFlowAclRule {
  id: string
  action: LotTransferType
  from: string | null
  to: string | null
  groups: Group[]
}

export type MaterialFlowAclRulePayload = Omit<MaterialFlowAclRule, 'id'>;
