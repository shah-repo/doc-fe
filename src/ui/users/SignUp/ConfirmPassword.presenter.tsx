import { Paper, Typography } from '@material-ui/core';
import { Form } from 'formik';
import * as React from 'react';
import { AsyncState } from '../../../state/types';
import InputField from '../../components/forms/fields/Input';
import { email, required, validator } from '../../components/forms/fields/validators';
import FormMessage from '../../components/forms/FormMessage';
import SubmitButton from '../../components/forms/SubmitButton';
import Text from '../../components/Text';
import { Translation } from '../../translations/types';
import { styles } from './SignUp.styles';

interface ConfirmPasswordPresenter {
  asyncState: AsyncState
  logo: string
  title: Translation
}

const ConfirmPasswordPresenter: React.FunctionComponent<ConfirmPasswordPresenter> = ({
  asyncState, logo, title,
}) => {
  const classes = styles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />
        <Typography variant="h4" className={classes.title} id="ConfirmPasswordPresenter-title">
          <Text translation={title} />
        </Typography>
        <Form className={classes.formStyle}>
          <FormMessage asyncState={asyncState} className={classes.status} id="ConfirmPasswordPresenter-formError" />
          <InputField
            name="email"
            label="login.email"
            size="sm"
            gutter={false}
            inputProps={{
              autoComplete: 'email', autoFocus: true, id: 'ConfirmPasswordPresenter-email', readOnly: true,
            }}
            validate={validator(required, email)}
            lpignore={false}
          />
          <InputField
            name="password"
            label="login.password"
            size="sm"
            gutter={false}
            inputProps={{
              autoComplete: 'current-password', id: 'ConfirmPasswordPresenter-password', type: 'password',
            }}
            validate={validator(required)}
            lpignore={false}
          />
          <InputField
            name="confirmPass"
            label="confirm.password"
            size="sm"
            gutter={false}
            inputProps={{
              autoComplete: 'current-password', id: 'ConfirmPasswordPresenter-confirmPass', type: 'password',
            }}
            validate={validator(required)}
            lpignore={false}
          />
          <SubmitButton
            asyncState={asyncState}
            label="login.submit"
            className={classes.submit}
            id="ConfirmPasswordPresenter-loginSubmit"
          />
        </Form>
      </Paper>
    </div>
  );
};

export default ConfirmPasswordPresenter;
