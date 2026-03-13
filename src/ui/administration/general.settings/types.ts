import { ExpansionPanelProps, FormControlLabelProps, SwitchProps } from '@material-ui/core';
import { ReactNode, RefObject } from 'react';

export enum GeneralSettingsTabs {
  Printing = 'Printing',
  AccountCodes = 'Account Codes',
  Navigation = 'Navigation',
  APITokens = 'API Tokens',
  AR = 'Approval Requests',
  MD = 'Material Disposition',
  ASLStatus = 'ASL Status',
  SupplierConfiguration = 'Supplier Configuration',
  LCP = 'Life Cycle Phases',
  LotAutoAllocationOrder = 'Lot Auto-allocation Order',
  ExpiredLots = 'Expired Lots',
  Integrations = 'Intergrations',
  EF = 'Equipment Family',
  ApprovalRoles = 'Approval Roles',
  Locations = 'Locations',
  MaterialFlow = 'Material Flow',
  SystemTransactions = 'System Transactions Setup',
  Training = 'Training',
  Timezone = 'Timezone',
  LHRBuild = 'LHR Build',
  TaxRate = 'Tax Rate',
}

export interface GeneralSettingsProps {
  isLoading: boolean
  updatedAt?: string
  onSave: () => void
}

export interface SettingsPanelProps extends ExpansionPanelProps {
  title: string
  info?: string
  containerRef?: RefObject<HTMLElement>
  isOutOfSync?: boolean
  onToggle: () => void
  onAddNew?: () => void
  onManageItems?: () => void
}

export interface SwitchControlProps extends SwitchProps {
  label: ReactNode
  labelProps?: Partial<FormControlLabelProps>
}

export interface HeaderLastSavedProps {
  timestamp: string
  loading?: boolean
  updateInterval?: number
}

export enum AUDIT_CHANGE_TYPE {
  DELETED = 'DELETED',
  ADDED = 'ADDED',
  UPDATED = 'UPDATED',
}

export interface CompanySettingsChangeLog {
  id: string
  companyId: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  parentKey: string
  parentKeyLabel: string
  fieldChanged: string
  changeType?: AUDIT_CHANGE_TYPE
  displayText: string
  updatedAt: string
  groupId: string
}
