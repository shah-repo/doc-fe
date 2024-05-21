import {
  Divider,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  Typography,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import {
  AllocationOrder,
  AllocationOrderType,
  GeneralSettings,
} from '../../../../../state/ducks/company/types';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import { styles } from './styles';

const LotAutoAllocationOrder: React.FC<SettingsPanelProps> = (props) => {
  const classes = styles();
  const { getFieldProps, setFieldValue } = useFormikContext<GeneralSettings>();
  const orderByReleaseDateKey = 'allocationConfig.sortOrderByReleaseDate';
  const orderByReleaseDateValue = getFieldProps(orderByReleaseDateKey)
    .value as AllocationOrderType;
  const isFIFOOrderingEnabled
    = orderByReleaseDateValue === AllocationOrder.FIFO;
  const isLIFOOrderingEnabled
    = orderByReleaseDateValue === AllocationOrder.LIFO;

  const handleFIFOOrderChange = (event: ChangeEvent<{}>, checked: boolean) => {
    if (checked) {
      setFieldValue(orderByReleaseDateKey, AllocationOrder.FIFO);
    }
  };

  const handleLIFOOrderChange = (event: ChangeEvent<{}>, checked: boolean) => {
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
      helperText={
        translate('administration.general.settings.lot.auto.allocation.order.helper.text')
      }
    >
      <List className={classes.list}>
        <ListItem disableGutters>
          <FormControlLabel
            className={classes.root}
            control={
              <Radio
                classes={{ root: classes.radio, checked: classes.checked }}
                size="small"
              />
            }
            labelPlacement="start"
            label={
              <Typography variant="body2" className={classes.radioLabel}>
                {translate(
                  'administration.general.settings.lot.auto.allocation.order.fifo.label',
                )}
              </Typography>
            }
            onChange={handleFIFOOrderChange}
            checked={isFIFOOrderingEnabled}
          />
        </ListItem>
        <Divider />
        <ListItem disableGutters>
          <FormControlLabel
            className={classes.root}
            control={
              <Radio
                classes={{ root: classes.radio, checked: classes.checked }}
                size="small"
              />
            }
            labelPlacement="start"
            label={
              <Typography variant="body2" className={classes.radioLabel}>
                {translate(
                  'administration.general.settings.lot.auto.allocation.order.lifo.label',
                )}
              </Typography>
            }
            onChange={handleLIFOOrderChange}
            checked={isLIFOOrderingEnabled}
          />
        </ListItem>
      </List>
    </SettingsPanel>
  );
};

export default LotAutoAllocationOrder;
