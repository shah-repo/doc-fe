import { Grid } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import useGetHasTag from '../../../../../../src/ui/hooks/useGetHasTag';
import { translate } from '../../../../../common/intl';
import { GroupTag } from '../../../../../state/ducks/auth/types';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { Checkbox, TextField } from '../../../../components/forms/fields-next';
import Text from '../../../../components/Text';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import useStyle from './styles';

const TrainingReminder: React.FC<SettingsPanelProps> = (props) => {
  const classes = useStyle();
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();
  const isCompanyAdmin = useGetHasTag(GroupTag.USER_MANAGEMENT);

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.training.reminder')}>
      <Text message="administration.general.settings.training.reminder.sub.title" />
      <Grid container className={cx(classes.gridContainer, isCompanyAdmin ? '' : classes.disabledGrid)}>
        <Grid item className={classes.gridItem}>
          <Checkbox
            className={classes.marginRight}
            checked={values.trainingReminder.trainingAssigned}
            {...getFieldProps('trainingReminder.trainingAssigned')} />
          <Text message="administration.general.settings.training.reminder.training.assigned" />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Checkbox
            className={classes.marginRight}
            checked={values.trainingReminder.sevenDays}
            {...getFieldProps('trainingReminder.sevenDays')} />
          <Text message="administration.general.settings.training.reminder.seven.days" />
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
          <Checkbox
            className={classes.marginRight}
            checked={values.trainingReminder.trainingDueToday}
            {...getFieldProps('trainingReminder.trainingDueToday')} />
          <Text message="administration.general.settings.training.reminder.training.due.date" />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Checkbox
            className={classes.marginRight}
            checked={values.trainingReminder.trainingOverdue}
            {...getFieldProps('trainingReminder.trainingOverdue')} />
          <Text message="administration.general.settings.training.reminder.training.overdue" />
        </Grid>
      </Grid>
    </SettingsPanel>
  );
};

export default TrainingReminder;
