import { withStyles, WithStyles } from '@material-ui/core';
import { Form } from 'formik';
import moment from 'moment';
import * as React from 'react';
import { useDate } from '../../../../common/utils/date';
import { AsyncState, AsyncStatus } from '../../../../state/types';
import { StyledCancelFBButton } from '../../../form.builder/FBButton/StyledCancelFBButton';
import DatePickerField from '../../forms/fields/DatePickerField';
import { required, validator } from '../../forms/fields/validators/index';
import FormMessage from '../../forms/FormMessage';
import FormProgress from '../../forms/FormProgress';
import StyledSubmitButton from '../../forms/StyledSubmitButton';
import styles from './EffectiveDateForm.styles';

interface EffectiveDateFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState
  cancel: () => void
}

const EffectiveDateForm: React.FunctionComponent<EffectiveDateFormProps> = ({ cancel, classes, asyncState }) => {
  const { timezone, getStartOfDayDateString } = useDate();

  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      <DatePickerField
        label="transition.action.effective.date"
        name="effectiveDate"
        minDate={getStartOfDayDateString(moment().tz(timezone).toISOString())}
        value={getStartOfDayDateString(moment().tz(timezone).toISOString())}
        validate={validator(required)}
      />
      <FormProgress asyncState={asyncState} />
      <StyledSubmitButton
        id="confirmEffectiveDate"
        asyncState={asyncState}
        label="transition.action.confirm"
        fullWidth={false}
        className={classes.submitButton}
      />
      <StyledCancelFBButton
        variant="text"
        color="secondary"
        className={classes.cancelButton}
        disabled={asyncState.status === AsyncStatus.Active}
        onClick={cancel}
        label="transition.action.cancel"
      />
    </Form>
  );
};

export default withStyles(styles)(EffectiveDateForm);
