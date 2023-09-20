import { ChangeEventHandler } from 'react';
import GeneralSettingsState from './GeneralSettings.state';

export enum GeneralSettingsTabs {
  Printing = 'Printing',
  AccountCodes = 'Account Codes',
  Navigation = 'Navigation',
  APITokens = 'API Tokens',
}

export interface GeneralSettingsProps {
  generalSettingsState:  GeneralSettingsState
  onSaveChanges: () => void
  handleTabChange: (event: React.ChangeEvent<{}>, value: any) => void
  tabValue: string
}

export interface PrinterProps {
  collapsed: boolean
  onConsumerKeyChange: (ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>)
  onTenantIDChange: (ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>)
  onPrinterSerialChange: (ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>)
  onCollapsedToggle: () => void
  generalSettingsState: GeneralSettingsState
  consumerKey?: string
  tenantID?: string
  printerSerial?: string
}
