import { LotTransferType } from '../../../ui/form.builder/FBLotTransfers/types';
import { Group } from '../auth/types';
import { Nullable } from '../common/types';

export interface MaterialFlowAclRule {
  id: string
  action: LotTransferType
  from: string
  to: Nullable<string>
  groups: Group[]
}

export type MaterialFlowAclRulePayload = Omit<MaterialFlowAclRule, 'id'>;
