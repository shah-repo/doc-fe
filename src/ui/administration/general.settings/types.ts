import { ExpansionPanelProps, SwitchProps } from '@material-ui/core';

export enum GeneralSettingsTabs {
  Printing = 'Printing',
  AccountCodes = 'Account Codes',
  Navigation = 'Navigation',
  APITokens = 'API Tokens',
  AR = 'Approval Requests',
}

export interface GeneralSettingsProps {
  isLoading: boolean
  updatedAt?: string
  onSave: () => void
}
export interface SettingsPanelProps extends ExpansionPanelProps {
  title: string
  onToggle: () => void
}

export interface SwitchControlProps extends SwitchProps {
  label: string
}

export interface HeaderLastSavedProps {
  timestamp: string
  loading?: boolean
  updateInterval?: number
}
