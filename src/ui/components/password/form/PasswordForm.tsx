import { Box, Button, Typography, withStyles, WithStyles } from '@material-ui/core';
import { Form } from 'formik';
import * as React from 'react';
import { translate } from '../../../../common/intl';
import { store } from '../../../../state/store';
import { AsyncState, AsyncStatus } from '../../../../state/types';
import { Autocomplete } from '../../forms/fields-next';
import InputField from '../../forms/fields/Input';
import { required, validator } from '../../forms/fields/validators';
import FormikTextEditor from '../../forms/FormikTextEditor/FormikTextEditor';
import FormMessage from '../../forms/FormMessage';
import FormProgress from '../../forms/FormProgress';
import SubmitButton from '../../forms/SubmitButton';
import Text from '../../Text';
import { Transition } from '../../transitionDialog/types';
import styles from './PasswordForm.styles';

interface PasswordFormProps extends WithStyles<typeof styles> {
  transition?: Transition
  asyncState: AsyncState
  cancel: () => void
}

const PasswordForm: React.FunctionComponent<PasswordFormProps> = ({ transition, cancel, classes, asyncState }) => {
  const { name } = store.getState().auth.user;

  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      <Box className={classes.labelContainer}>
        <Typography className={classes.label}>
          <Text translation="common.approvers" />
        </Typography>
        <Autocomplete
          disabled
          value={{ label: name, value: name }}
          getOptionLabel={(option) => option.label}
        />
      </Box>
      <InputField
        name="password"
        label="transition.action.password"
        dataCy="transition.action.password"
        labelProps={{ className: classes.label }}
        inputStyleProps={classes.inputFieldWrap}
        inputProps={{ type: 'password', className: classes.inputField }}
        validate={validator(required)}
      />
      {transition === 'reject' && <FormikTextEditor
        name="comment"
        label="transition.action.rejection.comment"
        dataCy="transition.action.rejection.comment"
        placeholder={translate('transition.action.rejection.comment.placeholder')}
        disabled={false}
      />}
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        id="passwordConfirm"
        dataCy="passwordConfirm"
        asyncState={asyncState}
        label="transition.action.confirm"
        fullWidth={false}
        className={classes.submitButton}
      />
      <Button
        variant="text"
        color="secondary"
        data-cy="reject.request"
        className={classes.cancelButton}
        disabled={asyncState.status === AsyncStatus.Active}
        onClick={cancel}
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default withStyles(styles)(PasswordForm);
