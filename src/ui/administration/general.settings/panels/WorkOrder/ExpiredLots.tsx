import { List, ListItem } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { ExpiredLotTypes, GeneralSettings, NotifyPartLCP } from '../../../../../state/ducks/company/types';
import { Autocomplete, FormControlLabel } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import SettingsPanel from '../../components/SettingsPanel';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';
import { DEFAULT_OPTION_MARKUP, EXPIRED_LOTS_KEY, NOTIFY_PART_LCP_KEY, OPTIONS } from './constants';
import useStyles from './styles';

const ExpiredLots: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue, values } = useFormikContext<GeneralSettings>();
  const hasPermission = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const isExpiredLotsAllowed = getFieldProps(EXPIRED_LOTS_KEY).value === ExpiredLotTypes.WARNING;
  const classes = useStyles();
  const [value, setValue] = React.useState(OPTIONS[0]);

  useEffect(() => {
    const value = OPTIONS.find(opt => opt.value === getFieldProps(NOTIFY_PART_LCP_KEY).value);
    if (value) {
      setValue(value);
    }
  }, [values]);

  const handleExpiredLotChange = (event: ChangeEvent<{}>, checked: boolean) => {
    setFieldValue(EXPIRED_LOTS_KEY, checked ? ExpiredLotTypes.WARNING : ExpiredLotTypes.ERROR);
  };

  const handleChange = (event: React.ChangeEvent<{}>, value: OptionType) => {
    setValue(value as any);
    setFieldValue(NOTIFY_PART_LCP_KEY, value.value);
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.expired.lots')}>
      <List className={classes.list}>
        <ListItem disableGutters>
          <SwitchControl
            {...getFieldProps('allocationConfig.expiredLotsPrompt')}
            checked={isExpiredLotsAllowed}
            disabled={!hasPermission}
            onChange={handleExpiredLotChange}
            label={translate('administration.general.settings.expired.lots.label')}
          />
        </ListItem>
        <ListItem disableGutters>
          <FormControlLabel
            className={classes.root}
            control={
              <Autocomplete
                {...getFieldProps(NOTIFY_PART_LCP_KEY)}
                key={value.value}
                className={classes.bomLCPDropdown}
                disableClearable
                forcePopupIcon
                size="small"
                value={value}
                options={OPTIONS}
                getOptionLabel={(option: OptionType) => option.label}
                shouldShowDefaultAdornment
                inputProps={{
                  endAdornment:
                    NotifyPartLCP.DO_NOTHING === value.value
                      ? <span className={classes.defaultOption}>{DEFAULT_OPTION_MARKUP}</span>
                      : undefined,
                }}
                renderOption={(option: OptionType) => {
                  if (option.value === NotifyPartLCP.DO_NOTHING) {
                    return (<>
                      <span>{option.label}</span>
                      <span className={classes.defaultOption}>&nbsp;{DEFAULT_OPTION_MARKUP}</span>
                    </>);
                  }
                  return <>{option.label}</>;
                }}
                onChange={handleChange}
              />
            }
            labelPlacement="start"
            label={translate('administration.general.settings.expired.lots.dropdown.label')}
          />
        </ListItem>
      </List>
    </SettingsPanel>
  );
};

export default ExpiredLots;
