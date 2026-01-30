import { Box, Grid } from '@material-ui/core';
import { CheckboxProps as MuiCheckboxProps } from '@material-ui/core/Checkbox';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { isProd } from '../../../../../common/utils/env.utils';
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

const Training: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();
  const classes = useStyle();

  const checkboxProps: MuiCheckboxProps = {
    color: 'primary',
    className: classes.marginRight,
  };
  const daysValue = getFieldProps<number>('trainingReminders.customDaysDueOn.days').value;
  const disabledCheckboxProps = { ...checkboxProps, disabled: true };
  const showError = isEmpty(String(daysValue)) || daysValue === 0 || String(daysValue).includes('-');

  return (
    <SettingsPanel
      {...props}
      title={translate('administration.general.settings.training')}
    >
      <SettingsPanelSection>
        <SwitchControl
          {...getFieldProps('isTrainingForApprovedRevisionsEnabled')}
          checked={values.isTrainingForApprovedRevisionsEnabled}
          label={
            <>
              <div className={classes.title}>
                {translate('administration.general.settings.training.training.approved.revisions')}
              </div>
              <div className={classes.description}>
                {translate('administration.general.settings.training.training.approved.revisions.info')}
              </div>
            </>
          }
        />
      </SettingsPanelSection>
      {!isProd() && (
        <SettingsPanelSection>
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
        </SettingsPanelSection>
      )}
      <Text message="administration.general.settings.training.reminders.sub.title" />
      <Grid
        container
        className={cx(classes.gridContainer, classes.marginBottom)}
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
        className={classes.gridContainer}
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
      <Box className={classes.gracePeriodContainer}>
        <div className={classes.title}>
          {translate('administration.general.settings.training.reminders.gracePeriodDays.title')}
        </div>
        <Box className={classes.gracePeriodDescription}>
          <div className={classes.description}>
            {translate('administration.general.settings.training.reminders.gracePeriodDays.sub.title')}
          </div>
          <Box>
            <TextField
              className={classes.textArea}
              {...getFieldProps('trainingReminders.gracePeriodDays')}
              fullWidth={false}
              type="number"
            />
            <Text message="administration.general.settings.training.reminders.custom.days" />
          </Box>
        </Box>
      </Box>
    </SettingsPanel>
  );
};

export default Training;
