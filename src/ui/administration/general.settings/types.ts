import { ExpansionPanelProps, SwitchProps } from '@material-ui/core';
import { RefObject } from 'react';

export enum GeneralSettingsTabs {
  Printing = 'Printing',
  AccountCodes = 'Account Codes',
  Navigation = 'Navigation',
  APITokens = 'API Tokens',
  AR = 'Approval Requests',
  MD = 'Material Disposition',
  LotAutoAllocationOrder = 'Lot Auto-allocation Order',
  ExpiredLots = 'Expired Lots',
  Integrations = 'Intergrations',
  EF = 'Equipment Family',
  ApprovalRoles = 'Approval Roles',
  Locations = 'Locations',
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
  onToggle: (isExpanded?: boolean) => void
  onAddNew?: () => void
}

export interface SwitchControlProps extends SwitchProps {
  label: string
}

export interface HeaderLastSavedProps {
  timestamp: string
  loading?: boolean
  updateInterval?: number
}
