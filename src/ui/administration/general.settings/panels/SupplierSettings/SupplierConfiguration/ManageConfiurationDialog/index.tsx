import { Box, Divider } from '@material-ui/core';
import cx from 'classnames';
import React, { useCallback, useState } from 'react';
import { translate } from '../../../../../../../common/intl';
import { Dialog } from '../../../../../../components/dialogs';
import StyledTab from '../../../../../../dashboard.new/tabs/common/StyledTab';
import StyledTabs from '../../../../../../dashboard.new/tabs/common/StyledTabs';
import { DialogHandler } from '../../../../../../hooks/useDialog';
import SupplierLabelsGrid from '../SupplierLabelGrid';
import useStyles from './styles';

export enum SupplierConfigTabValues {
  SupplierType = 'supplier-type',
  SupplierCapabilities = 'supplier-capabilities',
  SupplierServices = 'supplier-services',
}

interface Props {
  dialog: DialogHandler
}

const ManageConfigurationDialog: React.FunctionComponent<Props> = ({
  dialog,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState<SupplierConfigTabValues>(SupplierConfigTabValues.SupplierType);

  const handleChange = useCallback(
    (event: any, newValue: SupplierConfigTabValues) => setValue(newValue),
    [],
  );

  if (!dialog.isOpen) {
    return null;
  }

  return (
    <Dialog open={dialog.isOpen}
      title="common.manage.configuration.items"
      onClose={dialog.close}
      maxWidth="sm"
      PaperProps={{ id: 'manageConfigurationDialog', className: classes.paper }}
    >
      <Box className={classes.root}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="supplier configuration tabs"
        >
          <StyledTab
            className={classes.tab}
            value={SupplierConfigTabValues.SupplierType}
            label={translate('administration.general.settings.suppliers.label.grid.supplierType.title')}
          />
          <StyledTab
            className={classes.tab}
            value={SupplierConfigTabValues.SupplierCapabilities}
            label={translate('administration.general.settings.suppliers.label.grid.supplierCapabilities.title')}
          />
          <StyledTab
            className={classes.tab}
            value={SupplierConfigTabValues.SupplierServices}
            label={translate('administration.general.settings.suppliers.label.grid.supplierServices.title')}
          />
        </StyledTabs>
        <Divider />
        <Box className={cx(classes.tabs, 'containing-box-scrollbar')}>
          <div
            role="tabpanel"
            id={`scrollable-auto-tabpanel-${value}`}
            aria-labelledby={`scrollable-auto-tab-${value}`}
          >
            {value === SupplierConfigTabValues.SupplierType && <SupplierLabelsGrid name="supplierTypes" />}
            {value === SupplierConfigTabValues.SupplierCapabilities && <SupplierLabelsGrid name="supplierCapabilities" />}
            {value === SupplierConfigTabValues.SupplierServices && <SupplierLabelsGrid name="supplierServices" />}
          </div>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ManageConfigurationDialog;
