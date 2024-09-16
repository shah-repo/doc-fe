import { Grid } from '@material-ui/core';
import { CheckboxProps as MuiCheckboxProps } from '@material-ui/core/Checkbox';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { authSelectors } from '../../../../../state/ducks/auth';
import { GroupTag } from '../../../../../state/ducks/auth/types';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { Checkbox, TextField } from '../../../../components/forms/fields-next';
import CheckboxField from '../../../../components/forms/fields/Checkbox';
import Text from '../../../../components/Text';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import useStyle from './styles';

const TrainingReminders: React.FC<SettingsPanelProps> = (props) => {
  const classes = useStyle();
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();
  const currentUserTags = useSelector(authSelectors.currentEmployeeTags);
  const isCompanyAdmin = currentUserTags.includes(GroupTag.ADMIN_MANAGEMENT);
  const disabledCheckboxProps: MuiCheckboxProps = {
    disabled: true,
    color: 'primary',
    className: classes.marginRight,
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.training.reminders')}>
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
        className={cx(classes.gridContainer, { [classes.disabledGrid]: !isCompanyAdmin })}>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isAssignedCcActive')}
            checked={values.trainingReminders.isAssignedCcActive}
            label={translate('administration.general.settings.training.reminders.training.assigned')}
            checkboxProps={disabledCheckboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isSevenDaysDueOnCountdownCcActive')}
            checked={values.trainingReminders.isSevenDaysDueOnCountdownCcActive}
            label={translate('administration.general.settings.training.reminders.seven.days')}
            checkboxProps={disabledCheckboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.customDaysDueOn.isCcActive')}
            checked={values.trainingReminders.customDaysDueOn.isCcActive}
            label={`${values.trainingReminders.customDaysDueOn.days} ${translate('administration.general.settings.training.reminders.custom.days')}`}
            checkboxProps={disabledCheckboxProps}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            {...getFieldProps('trainingReminders.isOverdueCcActive')}
            checked={values.trainingReminders.isOverdueCcActive}
            label={translate('administration.general.settings.training.reminders.training.overdue')}
            checkboxProps={disabledCheckboxProps}
          />
        </Grid>
      </Grid>
    </SettingsPanel>
  );
};

export default TrainingReminders;
