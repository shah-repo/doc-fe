import { isArray, isNull } from 'lodash';
import { action, observable, set } from 'mobx';
import { intl } from '../../../common/intl';
import { toastError, toastSuccess } from '../../components/notifications';
import { COMPANY_SETTINGS_URL } from '../../constants/urls';
import FBRequest from '../../form.builder/FBApi/FBApi.request';
import { PrinterProps } from './GeneralSettings.types';

class GeneralSettingsState {
  @observable public consumerKey: string;
  @observable public tenantID: string;
  @observable public printerSerial: string;

  public constructor ({ consumerKey = '', tenantID = '', printerSerial = '' }: PrinterProps) {
    this.consumerKey = consumerKey;
    this.tenantID = tenantID;
    this.printerSerial = printerSerial;
    this.fetchPrinterData();
  }

  private getPrinterDataAPI: FBRequest<any, null> = new FBRequest(COMPANY_SETTINGS_URL);
  public postPrinterDataAPI: FBRequest<any, null> = new FBRequest(COMPANY_SETTINGS_URL);

  @action public setConsumerKey = (consumerKey: string) => {
    set(this, 'consumerKey', consumerKey);
  };

  @action public setTenantID = (tenantID: string) => {
    set(this, 'tenantID', tenantID);
  };

  @action public setPrinterSerial = (printerSerial: string) => {
    set(this, 'printerSerial', printerSerial);
  };

  private fetchPrinterData = () => {
    this.getPrinterDataAPI.set({
      url: COMPANY_SETTINGS_URL,
      method: 'get',
    }, (data, error) => {
      if (data && !isNull(data?.zebraPrint)) {
        const { apiKey, tenantId, printers } = data?.zebraPrint;
        this.setConsumerKey(apiKey);
        this.setTenantID(tenantId);
        this.setPrinterSerial(printers[0]?.sn);
      } else {
        const errorMessage = error?.message;
        toastError(isArray(errorMessage) ? errorMessage[0] : errorMessage);
      }
    });
  };

  public savePrinterData = () => {
    const param = {
      zebraPrint: {
        apiKey: String(this.consumerKey),
        tenantId: String(this.tenantID),
        printers: [{
          sn: String(this.printerSerial),
          isActive: true,
        }],
      },
    };
    this.postPrinterDataAPI.set({
      method: 'post',
      body: param,
    }, (data, error) => {
      if (data) {
        toastSuccess(intl.formatMessage({ id: 'administration.generalsettings.save.successful' }));
      } else {
        const errorMessage = error?.message;
        toastError(isArray(errorMessage) ? errorMessage[0] : errorMessage);
      }
    });
  };
}

export default GeneralSettingsState;
