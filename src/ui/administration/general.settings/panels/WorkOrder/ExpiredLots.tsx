import { Box, List, ListItem, TextField, Typography } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { ExpiredLotTypes, GeneralSettings, NotifyPartLCP } from '../../../../../state/ducks/company/types';
import { FormControlLabel } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import SettingsPanel from '../../components/SettingsPanel';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';
import { DEFAULT_OPTION_MARKUP, OPTIONS } from './constants';
import useStyles from './styles';

const ExpiredLots: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext<GeneralSettings>();
  const expiredLotsKey = 'allocationConfig.expiredLotsPrompt';
  const notifyPartLCPKey = 'shouldNotifyLcpMismatch';
  const hasPermission = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const isExpiredLotsAllowed = getFieldProps(expiredLotsKey).value === ExpiredLotTypes.WARNING;
  const classes = useStyles();
  const [value, setValue] = React.useState(OPTIONS[0]);

  useEffect(() => {
    const value = OPTIONS.find(opt => opt.value === getFieldProps(notifyPartLCPKey).value);
    if (value) {
      setValue(value);
    }
  }, [getFieldProps(notifyPartLCPKey)]);

  const handleExpiredLotChange = (event: ChangeEvent<{}>, checked: boolean) => {
    setFieldValue(expiredLotsKey, checked ? ExpiredLotTypes.WARNING : ExpiredLotTypes.ERROR);
  };

  const handleChange = (event: React.ChangeEvent<{}>, value: OptionType) => {
    setValue(value);
    setFieldValue(notifyPartLCPKey, value.value);
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
                {...getFieldProps(notifyPartLCPKey)}
                key={value.value}
                className={classes.bomLCPDropdown}
                disableClearable
                forcePopupIcon
                size="small"
                value={value}
                options={OPTIONS}
                getOptionLabel={(option: OptionType) => option.label}
                renderInput={(params: RenderInputParams) => (
                  <Box display="flex">
                    <Box width="100%" data-cy="bom-part-lcp">
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        placeholder={translate('common.select.or.enter.placeholder')}
                        InputProps={{
                          ...params.InputProps,
                          className: cx(params.InputProps.className, classes.bomLCPDropdownTextField),
                          style: { padding: '0px 30px 0px 9px', borderRadius: 3 },
                          startAdornment: <div>{params.InputProps.startAdornment}</div>,
                          endAdornment: (
                            <>
                              { NotifyPartLCP.DO_NOTHING === value.value && <span className={classes.defaultOption}>{DEFAULT_OPTION_MARKUP}</span>}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        inputProps={{
                          ...params.inputProps,
                          style: { padding: '4.5px 0' },
                        }}
                      />
                    </Box>
                  </Box>
                )}
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
            label={
              <Typography>
                {translate('administration.general.settings.expired.lots.dropdown.label')}
              </Typography>
            }
          />
        </ListItem>
      </List>
    </SettingsPanel>
  );
};

export default ExpiredLots;
