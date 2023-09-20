import React, { ChangeEventHandler, useState } from 'react';
import GeneralSettingsState from '../GeneralSettings.state';
import PrintingPresenter from './Printing.presenter';

interface PrintingProps {
  generalSettingsState: GeneralSettingsState
}

const PrintingContainer: React.FunctionComponent<PrintingProps> = ({ generalSettingsState }) => {
  const [collapsed, setCollapsed] = useState(false);

  const onConsumerKeyChange : ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (ev) => {
    generalSettingsState.setConsumerKey(ev.target.value);
  };

  const onTenantIDChange : ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (ev) => {
    generalSettingsState.setTenantID(ev.target.value);
  };

  const onPrinterSerialChange : ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (ev) => {
    generalSettingsState.setPrinterSerial(ev.target.value);
  };

  const onCollapsedToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <PrintingPresenter
      {...{ collapsed, onConsumerKeyChange, onTenantIDChange, onPrinterSerialChange, onCollapsedToggle, generalSettingsState }}
    />
  );
};

export default PrintingContainer;
