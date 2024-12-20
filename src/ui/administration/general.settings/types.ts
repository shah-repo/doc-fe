import { ExpansionPanelProps, FormControlLabelProps, SwitchProps } from '@material-ui/core';
import { ReactNode, RefObject } from 'react';

export enum GeneralSettingsTabs {
  Printing = 'Printing',
  AccountCodes = 'Account Codes',
  Navigation = 'Navigation',
  APITokens = 'API Tokens',
  AR = 'Approval Requests',
  MD = 'Material Disposition',
  LCP = 'Life Cycle Phases',
  LotAutoAllocationOrder = 'Lot Auto-allocation Order',
  ExpiredLots = 'Expired Lots',
  Integrations = 'Intergrations',
  EF = 'Equipment Family',
  Locations = 'Locations',
  MaterialFlow = 'Material Flow',
  SystemTransactions = 'System Transactions Setup',
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
  onToggle: () => void
  onAddNew?: () => void
}

export interface SwitchControlProps extends SwitchProps {
  label: ReactNode
  labelProps: Partial<FormControlLabelProps>
}

export interface HeaderLastSavedProps {
  timestamp: string
  loading?: boolean
  updateInterval?: number
}
