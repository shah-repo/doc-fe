import { Divider, List, ListItem, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { AllocationOrder, GeneralSettings } from '../../../../../state/ducks/company/types';
import { FormControlLabel, Radio } from '../../../../components/forms/fields-next';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import useStyles from './styles';

const LotAutoAllocationOrder: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext<GeneralSettings>();
  const hasPermission = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const orderByReleaseDateKey = 'allocationConfig.sortOrderByReleaseDate';
  const orderByReleaseDateValue = getFieldProps<AllocationOrder>(orderByReleaseDateKey).value;

  const classes = useStyles();

  const handleFIFOOrderChange = (event: ChangeEvent<unknown>, checked: boolean) => {
    if (checked) {
      setFieldValue(orderByReleaseDateKey, AllocationOrder.FIFO);
    }
  };

  const handleLIFOOrderChange = (event: ChangeEvent<unknown>, checked: boolean) => {
    if (checked) {
      setFieldValue(orderByReleaseDateKey, AllocationOrder.LIFO);
    }
  };

  return (
    <SettingsPanel
      {...props}
      title={translate(
        'administration.general.settings.lot.auto.allocation.order',
      )}
      info={
        translate('administration.general.settings.lot.auto.allocation.order.info')
      }
    >
      <List className={classes.list}>
        <ListItem disableGutters>
          <FormControlLabel
            className={classes.root}
            control={
              <Radio
                classes={{ root: classes.radio, checked: classes.checked, disabled: classes.disabled }}
                size="small"
                disabled={!hasPermission}
              />
            }
            labelPlacement="start"
            key={orderByReleaseDateValue}
            label={
              <Typography variant="body2" className={classes.radioLabel}>
                {translate(
                  'administration.general.settings.lot.auto.allocation.order.fifo.label',
                )}
              </Typography>
            }
            onChange={handleFIFOOrderChange}
            checked={orderByReleaseDateValue === AllocationOrder.FIFO}
          />
        </ListItem>
        <Divider />
        <ListItem disableGutters>
          <FormControlLabel
            className={classes.root}
            control={
              <Radio
                classes={{ root: classes.radio, checked: classes.checked, disabled: classes.disabled }}
                disabled={!hasPermission}
                size="small"
              />
            }
            labelPlacement="start"
            key={orderByReleaseDateValue}
            label={
              <Typography variant="body2" className={classes.radioLabel}>
                {translate(
                  'administration.general.settings.lot.auto.allocation.order.lifo.label',
                )}
              </Typography>
            }
            onChange={handleLIFOOrderChange}
            checked={orderByReleaseDateValue === AllocationOrder.LIFO}
          />
        </ListItem>
      </List>
    </SettingsPanel>
  );
};

export default LotAutoAllocationOrder;
