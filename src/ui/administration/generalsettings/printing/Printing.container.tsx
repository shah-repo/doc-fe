import React, { useState } from 'react';
import PrintingPresenter from './Printing.presenter';

const PrintingContainer: React.FunctionComponent = () => {
	const[collapsed, setCollapsed] = useState(false);
	const[consumerKey, setConsumerKey] = useState('');
	const[tenantID, setTenantID] = useState('');
	const[printerSerial, setPrinterSerial] = useState('');

	const onConsumerKeyChange = (ev: any) => {
		setConsumerKey(ev.target.value);
	};

	const onTenantIDChange = (ev: any) => {
		setTenantID(ev.target.value);
	};

	const onPrinterSerialChange = (ev: any) => {
		setPrinterSerial(ev.target.value);
	};

	const onCollapsedClick = () => {
		console.log('---setCollapsed----', { collapsed });
		setCollapsed(!collapsed);
	};

	return (
		<PrintingPresenter
		{...{ collapsed, consumerKey, tenantID, printerSerial, onConsumerKeyChange, onTenantIDChange, onPrinterSerialChange, onCollapsedClick }}
		// onCollapsedClick={() => setCollapsed(!collapsed)}
		/>
	);
};

export default PrintingContainer;
