import { Box, Divider } from '@material-ui/core';
import cx from 'classnames';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../../../common/intl';
import { companySelectors } from '../../../../../../../state/ducks/company';
import { AsyncStatus } from '../../../../../../../state/types';
import { Dialog } from '../../../../../../components/dialogs';
import StyledTab from '../../../../../../dashboard.new/tabs/common/StyledTab';
import StyledTabs from '../../../../../../dashboard.new/tabs/common/StyledTabs';
import { DialogHandler } from '../../../../../../hooks/useDialog';
import SupplierLabelsGrid from '../SupplierLabelGrid';
import useStyles from './styles';

enum SupplierConfigTabValues {
  SupplierType = 'supplier-type',
  SupplierCapabilities = 'supplier-capabilities',
  SupplierServices = 'supplier-services',
}

interface ManageConfigurationDialogProps {
  dialog: DialogHandler
}

const ManageConfigurationDialog: React.FunctionComponent<ManageConfigurationDialogProps> = ({
  dialog,
}) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState<SupplierConfigTabValues>(SupplierConfigTabValues.SupplierType);
  const asyncState = useSelector(companySelectors.getGeneralSettingsAsyncState);
  const isLoading = asyncState.status === AsyncStatus.Active;

  const handleChange = useCallback(
    (event: ChangeEvent<{}>, newValue: SupplierConfigTabValues) => setSelectedTab(newValue),
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
      loading={isLoading}
    >
      <Box className={classes.root}>
        <StyledTabs
          value={selectedTab}
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
            id={`scrollable-auto-tabpanel-${selectedTab}`}
            aria-labelledby={`scrollable-auto-tab-${selectedTab}`}
          >
            {selectedTab === SupplierConfigTabValues.SupplierType && <SupplierLabelsGrid name="supplierTypes" />}
            {selectedTab === SupplierConfigTabValues.SupplierCapabilities && <SupplierLabelsGrid name="supplierCapabilities" />}
            {selectedTab === SupplierConfigTabValues.SupplierServices && <SupplierLabelsGrid name="supplierServices" />}
          </div>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ManageConfigurationDialog;
