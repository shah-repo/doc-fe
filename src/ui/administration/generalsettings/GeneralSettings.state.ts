import { AxiosRequestConfig } from 'axios';
import { isArray } from 'lodash';
import { action, observable, set } from 'mobx';
import { intl } from '../../../common/intl';
import apiClient from '../../../state/apiClient';
import { store } from '../../../state/store';
import { toastError, toastSuccess } from '../../components/notifications';
import { COMPANY_SETTINGS_URL } from '../../constants/urls';
import { PrinterProps } from './GeneralSettings.types';

class GeneralSettingsState {
  @observable public consumerKey: string;
  @observable public tenantID: string;
  @observable public printerSerial: string;

  public constructor ({ consumerKey, tenantID, printerSerial }: PrinterProps) {
    this.consumerKey = consumerKey;
    this.tenantID = tenantID;
    this.printerSerial = printerSerial;
    this.fetchPrinterData();
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

  private fetchPrinterData = () => {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: COMPANY_SETTINGS_URL,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { apiKey, tenantId, printers } = data?.zebraPrint;
        this.setConsumerKey(apiKey);
        this.setTenantID(tenantId);
        this.setPrinterSerial(printers?.sn);
      })
      .catch((exception) => {
        const errorMessage = exception?.response?.data?.message;
        toastError(isArray(errorMessage) ? errorMessage[0] : errorMessage);
      });
  };

  @action public savePrinterData = () => {
    const param = {
      zebraPrint: {
        apiKey: String(this.consumerKey),
        tenantId: String(this.tenantID),
        printers: {
          sn: String(this.printerSerial),
          isActive: true,
        },
      },
    };
    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: COMPANY_SETTINGS_URL,
      data: param,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { apiKey, tenantId, printers } = data?.zebraPrint;
        this.setConsumerKey(apiKey);
        this.setTenantID(tenantId);
        this.setPrinterSerial(printers?.sn);
        toastSuccess(intl.formatMessage({ id: 'administration.generalsettings.save.successful' }));
      })
      .catch((exception) => {
        const errorMessage = exception?.response?.data?.message;
        toastError(isArray(errorMessage) ? errorMessage[0] : errorMessage);
      });
  };
}

export default GeneralSettingsState;
