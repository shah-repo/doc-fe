import { Box, Collapse, Divider, TextField } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React from 'react';
import { FBLabel } from '../../../form.builder';
import { GeneralSettingsTabs } from '../tabs.types';

interface PrinterProps {
	collapsed: boolean
	consumerKey: string
	tenantID: string
	printerSerial: string
	onConsumerKeyChange: () => void
	onTenantIDChange: () => void
	onPrinterSerialChange: () => void
	onCollapsedClick: () => void
}

const PrintingPresenter: React.FunctionComponent<PrinterProps> = ({
	collapsed,
	consumerKey,
	tenantID,
	printerSerial,
	onConsumerKeyChange,
	onTenantIDChange,
	onPrinterSerialChange,
	onCollapsedClick
}) => {
	console.log('----collapsed-----', { collapsed });
	return (
		<Box paddingLeft={3} paddingRight={3} minWidth="60%">
		{/* <div> */}
			<Collapse in={!collapsed} collapsedHeight={40} style={{ border: '2px lightgrey solid', padding: '20px', borderRadius: '4px' }}>
				<Box display="flex">
			{collapsed ? (
			<ExpandLess onClick={onCollapsedClick} />)
			:	<ExpandMore onClick={onCollapsedClick} />
			}
			<FBLabel
			label={GeneralSettingsTabs.Printing}
			labelProps={{ paddingLeft: '10px' }} />
			</Box>
			<Box paddingLeft={4}>
			<FBLabel label="administration.generalsettings.printing.tab.title"
			labelProps={{ marginTop: '20px' }} />
			<Divider />
			<FBLabel
			label="administration.generalsettings.printing.tab.consumer.key"
			labelProps={{ marginTop: '20px', lineHeight: '15px', fontWeight: '600', fontSize: '12px' }} />
			<TextField variant="outlined" fullWidth />
			<FBLabel
			label="administration.generalsettings.printing.tab.tenant.id"
			labelProps={{ marginTop: '20px', lineHeight: '15px', fontWeight: '600', fontSize: '12px' }} />
			<TextField variant="outlined" fullWidth />
			<FBLabel
			label="administration.generalsettings.printing.tab.printer.serial"
			labelProps={{ marginTop: '20px', lineHeight: '15px', fontWeight: '600', fontSize: '12px' }} />
			<TextField variant="outlined" fullWidth />
			</Box>
			</Collapse>
		{/* </div> */}
		</Box>
	);
};

export default PrintingPresenter;
