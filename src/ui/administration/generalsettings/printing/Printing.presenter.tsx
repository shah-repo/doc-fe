import { Box, Collapse, Divider, TextField } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { observer } from 'mobx-react';
import React from 'react';
import { FBLabel } from '../../../form.builder';
import { labelStyle, styles } from '../GeneralSettings.styles';
import { GeneralSettingsTabs, PrinterProps } from '../GeneralSettings.types';

const PrintingPresenter: React.FunctionComponent<PrinterProps> = ({
  collapsed,
  onConsumerKeyChange,
  onTenantIDChange,
  onPrinterSerialChange,
  onCollapsedToggle,
  generalSettingsState,
}) => {
  const { consumerKey, tenantID, printerSerial } = generalSettingsState;
  const classes = styles();
  return (
    <Box paddingLeft={3} paddingRight={3} minWidth="60%">
      <Collapse in={!collapsed} collapsedHeight={60} className={classes.collapseContainer}>
        <Box display="flex">
          {collapsed ? (
            <ExpandLess onClick={onCollapsedToggle} className={classes.expandIcon} />)
            : <ExpandMore onClick={onCollapsedToggle} className={classes.expandIcon} />
          }
          <FBLabel
            label={GeneralSettingsTabs.Printing}
            labelProps={labelStyle.printingTitle} />
        </Box>
        <Box paddingLeft={4}>
          <FBLabel label="administration.generalsettings.printing.tab.title"
            labelProps={labelStyle.printingSubTitle} />
          <Divider />
          <FBLabel
            label="administration.generalsettings.printing.tab.consumer.key"
            labelProps={labelStyle.labelProps} />
          <TextField
            value={consumerKey}
            variant="outlined"
            fullWidth
            onChange={onConsumerKeyChange} />
          <FBLabel
            label="administration.generalsettings.printing.tab.tenant.id"
            labelProps={labelStyle.labelProps} />
          <TextField
            value={tenantID}
            variant="outlined"
            fullWidth
            onChange={onTenantIDChange} />
          <FBLabel
            label="administration.generalsettings.printing.tab.printer.serial"
            labelProps={labelStyle.labelProps} />
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

export default observer(PrintingPresenter);
