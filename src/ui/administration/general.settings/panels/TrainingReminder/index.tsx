import { Grid } from '@material-ui/core';
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

const TrainingReminder: React.FC<SettingsPanelProps> = (props) => {
  const classes = useStyle();
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();
  const currentUserTags = useSelector(authSelectors.currentEmployeeTags);
  const isCompanyAdmin = currentUserTags.includes(GroupTag.ADMIN_MANAGEMENT);

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.training.reminder')}>
      <Text message="administration.general.settings.training.reminder.sub.title" />
      <Grid container className={cx(classes.gridContainer, isCompanyAdmin ? '' : classes.disabledGrid)}>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            name="trainingReminder.trainingAssigned"
            checked={values.trainingReminder.trainingAssigned}
            {...getFieldProps('trainingReminder.trainingAssigned')}
            label={translate('administration.general.settings.training.reminder.training.assigned')}
            checkboxProps={{ disabled: true, color: 'primary', className: classes.marginRight }} />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            name="trainingReminder.sevenDays"
            checked={values.trainingReminder.sevenDays}
            {...getFieldProps('trainingReminder.sevenDays')}
            label={translate('administration.general.settings.training.reminder.seven.days')}
            checkboxProps={{ disabled: true, color: 'primary', className: classes.marginRight }} />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Checkbox
            className={classes.marginRight}
            checked={values.trainingReminder.customDays.isChecked}
            {...getFieldProps('trainingReminder.customDays.isChecked')} />
          <TextField
            className={classes.textArea}
            fullWidth={false}
            type="number"
            value={values.trainingReminder.customDays.value}
            {...getFieldProps('trainingReminder.customDays.value')} />
          <Text message="administration.general.settings.training.reminder.custom.days" />
        </Grid>
        <Grid item className={classes.gridItem}>
          <CheckboxField
            name="trainingReminder.trainingOverdue"
            checked={values.trainingReminder.trainingOverdue}
            {...getFieldProps('trainingReminder.trainingOverdue')}
            label={translate('administration.general.settings.training.reminder.training.overdue')}
            checkboxProps={{ disabled: true, color: 'primary', className: classes.marginRight }} />
        </Grid>
      </Grid>
    </SettingsPanel>
  );
};

export default TrainingReminder;
