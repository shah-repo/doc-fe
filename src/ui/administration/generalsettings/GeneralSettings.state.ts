import { action, observable, set } from 'mobx';
import { PrinterProps } from './GeneralSettings.types';

class GeneralSettingsState {
  @observable public consumerKey: string;
  @observable public tenantID: string;
  @observable public printerSerial: string;

  public constructor ({ consumerKey, tenantID, printerSerial }: PrinterProps) {
    this.consumerKey = consumerKey;
    this.tenantID = tenantID;
    this.printerSerial = printerSerial;
  }

  @action public setConsumerKey = (consumerKey: string) => {
    set(this, 'consumerKey', consumerKey);
  };

  @action public setTenantID = (tenantID: string) => {
    set(this, 'tenantID', tenantID);
  };

  @action public setPrinterSerial = (printerSerial: string) => {
    set(this, 'printerSerial', printerSerial);
  };
}

export default GeneralSettingsState;
