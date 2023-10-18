import { ChangeEventHandler } from 'react';

export enum GeneralSettingsTabs {
  Printing = 'Printing',
  AccountCodes = 'Account Codes',
  Navigation = 'Navigation',
  APITokens = 'API Tokens',
  AR = 'Approval Requests',
}

export interface GeneralSettingsProps {
  onSaveChanges: () => void
  handleTabChange: (event: React.ChangeEvent<{}>, value: GeneralSettingsTabs) => void
  tabValue: string
}

export interface PrinterProps {
  collapsed: boolean
  onConsumerKeyChange: (ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>)
  onTenantIDChange: (ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>)
  onPrinterSerialChange: (ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>)
  onCollapsedToggle: () => void
  consumerKey?: string
  tenantID?: string
  printerSerial?: string
}
