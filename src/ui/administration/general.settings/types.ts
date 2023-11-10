import { ExpansionPanelProps, SwitchProps } from '@material-ui/core';
import { FormikContextType } from 'formik';
import { ZebraPrintSettings } from '../../../state/ducks/company/types';
import { DialogHandler } from '../../hooks/useDialog';

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
  onAddNew?: (editData: ZebraPrintSettings) => void
  onDelete?: (data: ZebraPrintSettings) => void
  onUpdate?: () => void
  onCancel?: () => void
  isOpen?: boolean
  dataResult?: []
  editData?: ZebraPrintSettings
  onSelectionChange?: () => void
  formik?: FormikContextType<ZebraPrintSettings>
  confirmationDialog?: DialogHandler
  confirmDeletePrinter?: () => void
  cancelDeletePrinter?: () => void
}

export interface SwitchControlProps extends SwitchProps {
  label: string
}

export interface HeaderLastSavedProps {
  timestamp: string
  loading?: boolean
  updateInterval?: number
}
