import { Button, withStyles, WithStyles } from '@material-ui/core';
import { Form } from 'formik';
import * as React from 'react';
import { SMTextEditor } from '../../../../../../App';
import { translate } from '../../../../../../common/intl';
import { store } from '../../../../../../state/store';
import { AsyncState, AsyncStatus } from '../../../../../../state/types';
import AutocompleteField from '../../../../../components/forms/fields/Autocomplete/Autocomplete';
import InputField from '../../../../../components/forms/fields/Input';
import { required, validator } from '../../../../../components/forms/fields/validators';
import FormMessage from '../../../../../components/forms/FormMessage';
import FormProgress from '../../../../../components/forms/FormProgress';
import SubmitButton from '../../../../../components/forms/SubmitButton';
import Text from '../../../../../components/Text';
import styles from './PasswordForm.styles';

interface PasswordFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState
  cancel: () => void
}

const PasswordFormApproval: React.FunctionComponent<PasswordFormProps> = ({
  cancel,
  classes,
  asyncState,
}) => {
  const { name } = store.getState().auth.user;
  const defaultValue = { label: name, value: name };
  return (
    <Form className={classes.container}>
      <FormMessage asyncState={asyncState} />
      <AutocompleteField
        name="approvals"
        label="common.approvers"
        autocompleteProps={{
          id: 'approvals',
          isClearable: false,
          styles,
          backspaceRemovesValue: false,
          value: defaultValue,
        }}
        isDisabled
        options={[defaultValue]}
      />
      <InputField
        name="password"
        label="document.action.password"
        dataCy="transition.action.password"
        labelProps={{ className: classes.label }}
        inputStyleProps={classes.inputFieldWrap}
        inputProps={{ type: 'password', placeholder: translate('common.enter.here'), className: classes.inputField }}
        validate={validator(required)}
      />
      <SMTextEditor
        name="comment"
        label="transition.action.rejection.comment"
        dataCy="transition.action.rejection.comment"
        placeholder={translate('transition.action.rejection.comment.placeholder')}
        disabled={false}
      />
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        id="passwordConfirm"
        dataCy="passwordConfirm"
        asyncState={asyncState}
        label="transition.action.confirm"
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

export default withStyles(styles)(PasswordFormApproval);
