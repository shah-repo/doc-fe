import React, { useState } from 'react';
import GeneralSettingsState from '../GeneralSettings.state';
import PrintingPresenter from './Printing.presenter';

interface PrintingProps {
  generalSettingsState: GeneralSettingsState
}

const PrintingContainer: React.FunctionComponent<PrintingProps> = ({ generalSettingsState }) => {
  const [collapsed, setCollapsed] = useState(false);
  // const[consumerKey, setConsumerKey] = useState('C0focWIzjJFEL2Yai3VioUNGYvEeCBXN');
  // const[tenantID, setTenantID] = useState('bb42c8d2b03adda0adf0b1c0029ceffd');
  // const[printerSerial, setPrinterSerial] = useState('D0J213101579');

  const onConsumerKeyChange = (ev: any) => {
    // setConsumerKey(ev.target.value);
    generalSettingsState.setConsumerKey(ev.target.value);
  };

  const onTenantIDChange = (ev: any) => {
    // setTenantID(ev.target.value);
    generalSettingsState.setTenantID(ev.target.value);
  };

  const onPrinterSerialChange = (ev: any) => {
    // setPrinterSerial(ev.target.value);
    generalSettingsState.setPrinterSerial(ev.target.value);
  };

  const onCollapsedClick = () => {
    console.log('---setCollapsed----', { collapsed });
    setCollapsed(!collapsed);
  };

  return (
    <PrintingPresenter
      {...{ collapsed, onConsumerKeyChange, onTenantIDChange, onPrinterSerialChange, onCollapsedClick, generalSettingsState }}
    // onCollapsedClick={() => setCollapsed(!collapsed)}
    />
  );
};

export default PrintingContainer;
