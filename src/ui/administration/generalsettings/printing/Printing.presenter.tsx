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

const labelProps = { marginTop: '20px', lineHeight: '15px', fontWeight: '600', fontSize: '12px', color: '#080B11' };

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
			<Collapse in={!collapsed} collapsedHeight={60} style={{ border: '2px lightgrey solid', padding: '20px', borderRadius: '4px' }}>
				<Box display="flex">
			{collapsed ? (
			<ExpandLess onClick={onCollapsedClick} style={{ color: '#011FBB' }} />)
			:	<ExpandMore onClick={onCollapsedClick} style={{ color: '#011FBB' }} />
			}
			<FBLabel
			label={GeneralSettingsTabs.Printing}
			labelProps={{ paddingLeft: '10px', lineHeight: '20px', fontWeight: '600', color: '#011FBB' }} />
			</Box>
			<Box paddingLeft={4}>
			<FBLabel label="administration.generalsettings.printing.tab.title"
			labelProps={{ marginTop: '20px' }} />
			<Divider />
			<FBLabel
			label="administration.generalsettings.printing.tab.consumer.key"
			labelProps={labelProps} />
			<TextField
			value={consumerKey}
			variant="outlined"
			fullWidth
			onChange={onConsumerKeyChange} />
			<FBLabel
			label="administration.generalsettings.printing.tab.tenant.id"
			labelProps={labelProps} />
			<TextField
			value={tenantID}
			variant="outlined"
			fullWidth
			onChange={onTenantIDChange} />
			<FBLabel
			label="administration.generalsettings.printing.tab.printer.serial"
			labelProps={labelProps} />
			<TextField
			value={printerSerial}
			variant="outlined"
			fullWidth
			onChange={onPrinterSerialChange} />
			</Box>
			</Collapse>
		</Box>
	);
};

export default PrintingPresenter;
