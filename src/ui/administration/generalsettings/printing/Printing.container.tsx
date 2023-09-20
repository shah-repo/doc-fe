import React, { useState } from 'react';
import GeneralSettingsState from '../GeneralSettings.state';
import PrintingPresenter from './Printing.presenter';

interface PrintingProps {
  generalSettingsState: GeneralSettingsState
}

const PrintingContainer: React.FunctionComponent<PrintingProps> = ({ generalSettingsState }) => {
  const [collapsed, setCollapsed] = useState(false);

  const onConsumerKeyChange = (ev: any) => {
    generalSettingsState.setConsumerKey(ev.target.value);
  };

  const onTenantIDChange = (ev: any) => {
    generalSettingsState.setTenantID(ev.target.value);
  };

  const onPrinterSerialChange = (ev: any) => {
    generalSettingsState.setPrinterSerial(ev.target.value);
  };

  const onCollapsedClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <PrintingPresenter
      {...{ collapsed, onConsumerKeyChange, onTenantIDChange, onPrinterSerialChange, onCollapsedClick, generalSettingsState }}
    />
  );
};

export default PrintingContainer;
