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
  onConsumerKeyChange: (ev: any) => void
  onTenantIDChange: (ev: any) => void
  onPrinterSerialChange: (ev: any) => void
  onCollapsedClick: () => void
  generalSettingsState: GeneralSettingsState
  consumerKey?: string
  tenantID?: string
  printerSerial?: string
}
