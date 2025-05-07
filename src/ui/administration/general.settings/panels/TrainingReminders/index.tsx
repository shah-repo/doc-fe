import { Box, Grid } from '@material-ui/core';
import { CheckboxProps as MuiCheckboxProps } from '@material-ui/core/Checkbox';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { authSelectors } from '../../../../../state/ducks/auth';
import { GroupTag } from '../../../../../state/ducks/auth/types';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { Checkbox, FormField, TextField } from '../../../../components/forms/fields-next';
import CheckboxField from '../../../../components/forms/fields/Checkbox';
import Text from '../../../../components/Text';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsPanelSection from '../../components/SettingsPanelSection';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';
import useStyle from './styles';

const erroMessage = (customDays: number) => {
  const value = String(customDays);

  if (!value || isEmpty(value)) {
    return translate('validator.must.be.number');
  } else if (value.includes('-')) {
    return translate('validators.positive.number');
  } else if (customDays === 0) {
    return translate('validators.greater.than.zero');
  }
};

const TrainingReminders: React.FC<SettingsPanelProps> = (props) => {
  const classes = useStyle();
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();
  const currentUserTags = useSelector(authSelectors.currentEmployeeTags);
  const isCompanyAdmin = currentUserTags.includes(GroupTag.ADMIN_MANAGEMENT);
  const checkboxProps: MuiCheckboxProps = {
    color: 'primary',
    className: classes.marginRight,
  };
  const daysValue = getFieldProps('trainingReminders.customDaysDueOn.days').value;
  const disabledCheckboxProps = { ...checkboxProps, disabled: true };
  const showError = isEmpty(String(daysValue)) || daysValue === 0 || String(daysValue).includes('-');

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.training.reminders')}>
      {process.env.NODE_ENV !== 'production' && <SettingsPanelSection>
        <SwitchControl
          {...getFieldProps('trainingReminders.isEmailSendingEnabled')}
          checked={values.trainingReminders.isEmailSendingEnabled}
          label={
            <>
              <div className={classes.title}>
                {translate('administration.general.settings.training.reminders.email.sending.title')}
              </div>
              <div className={classes.description}>
                {translate('administration.general.settings.training.reminders.info')}
              </div>
            </>
          }
        />
      </SettingsPanelSection>}
      <Text message="administration.general.settings.training.reminders.sub.title" />
      <Grid
        container
        className={cx(classes.gridContainer, classes.marginBottom, { [classes.disabledGrid]: !isCompanyAdmin })}
      >
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isAssignedActive')}
            checked={values.trainingReminders.isAssignedActive}
            label={translate('administration.general.settings.training.reminders.training.assigned')}
            checkboxProps={disabledCheckboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isSevenDaysDueOnCountdownActive')}
            checked={values.trainingReminders.isSevenDaysDueOnCountdownActive}
            label={translate('administration.general.settings.training.reminders.seven.days')}
            checkboxProps={disabledCheckboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <FormField
            required
            error={showError}
            helperText={showError ? erroMessage(daysValue) : ''}>
            <Box>
              <Checkbox
                className={classes.marginRight}
                {...getFieldProps('trainingReminders.customDaysDueOn.isActive')}
                checked={values.trainingReminders.customDaysDueOn.isActive}
              />
              <TextField
                className={classes.textArea}
                {...getFieldProps('trainingReminders.customDaysDueOn.days')}
                fullWidth={false}
                type="number"
              />
              <Text message="administration.general.settings.training.reminders.custom.days" />
            </Box>
          </FormField>
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isOverdueActive')}
            checked={values.trainingReminders.isOverdueActive}
            label={translate('administration.general.settings.training.reminders.training.overdue')}
            checkboxProps={disabledCheckboxProps}
          />
        </Grid>
      </Grid>
      <Text message="administration.general.settings.training.reminders.cc.training.notifications" />
      <Grid
        container
        className={cx(classes.gridContainer, { [classes.disabledGrid]: !isCompanyAdmin })}
      >
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isAssignedCcActive')}
            checked={values.trainingReminders.isAssignedCcActive}
            label={translate('administration.general.settings.training.reminders.training.assigned')}
            checkboxProps={checkboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isSevenDaysDueOnCcActive')}
            checked={values.trainingReminders.isSevenDaysDueOnCcActive}
            label={translate('administration.general.settings.training.reminders.seven.days')}
            checkboxProps={checkboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isThreeDaysDueOnCcActive')}
            checked={values.trainingReminders.isThreeDaysDueOnCcActive}
            label={translate('administration.general.settings.training.reminders.three.days')}
            checkboxProps={checkboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isTodayDueOnCcActive')}
            checked={values.trainingReminders.isTodayDueOnCcActive}
            label={translate('administration.general.settings.training.reminders.today')}
            checkboxProps={checkboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isOverdueCcActive')}
            checked={values.trainingReminders.isOverdueCcActive}
            label={translate('administration.general.settings.training.reminders.training.overdue')}
            checkboxProps={checkboxProps}
          />
        </Grid>
      </Grid>
    </SettingsPanel>
  );
};

export default TrainingReminders;
