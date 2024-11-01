import { ExpansionPanelProps, SwitchProps } from '@material-ui/core';
import { RefObject } from 'react';
import { PremiumFeatures } from '../../../state/ducks/company/types';

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

export interface PremiumFeaturesProps {
  isLoading: boolean
  updatedAt?: string
  onSave: () => void
  setValue: (field: string, value: boolean, shouldValidate?: boolean | undefined) => any
  values: PremiumFeatures
}

export interface BlueTagWithWhiteTextProps {
  whiteMainText?: string
}

export interface SettingsPanelProps extends ExpansionPanelProps {
  title: string
  info?: string
  containerRef?: RefObject<HTMLElement>
  onToggle: () => void
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
