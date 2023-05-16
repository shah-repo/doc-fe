import { Box, Paper, Typography } from '@material-ui/core';
import { Form } from 'formik';
import * as React from 'react';
import { AsyncState } from '../../../state/types';
import InputField from '../../components/forms/fields/Input';
import { required, validator } from '../../components/forms/fields/validators';
import FormMessage from '../../components/forms/FormMessage';
import SubmitButton from '../../components/forms/SubmitButton';
import Text from '../../components/Text';
import { styles } from './ResetPassword.styles';

interface Props {
  asyncState: AsyncState;
  logo: string;
}

const ResetPasswordPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  logo,
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
        <Box display="flex" textAlign="center" mb={3} data-cy="ResetPassword-title">
          <Typography variant="h4" className={classes.title}>
            <Text translation={'reset.password'} />
          </Typography>
        </Box>
        <Box display="flex" textAlign="center" data-cy="ResetPassword-subtitle">
          <Typography variant="h5"className={classes.subtitle} >
            <Text translation={'reset.choose.new.password'} />
          </Typography>
        </Box>
        <Form className={classes.formStyle}>
          <FormMessage asyncState={asyncState} className={classes.status} id="ResetPassword-formError"/>
          <InputField
            name="email"
            label="reset.enter.email"
            size="sm"
            gutter={false}
            inputProps={{
              autoComplete: 'email',
              type: 'text',
            }}
            validate={validator(required)}
            lpignore={false}
            dataCy={'email'}
          />
          <InputField
            name="currentPassword"
            label="reset.enter.current.password"
            size="sm"
            gutter={false}
            inputProps={{
              autoComplete: 'reset-password',
              type: 'password',
            }}
            validate={validator(required)}
            lpignore={false}
            dataCy={'currentPassword'}
          />
          <InputField
            name="newPassword"
            label="reset.enter.new.password"
            size="sm"
            gutter={false}
            inputProps={{
              autoComplete: 'reset-password',
              type: 'password',
            }}
            validate={validator(required)}
            lpignore={false}
            dataCy={'newPasswordFirstInput'}
          />
          <InputField
            name="newPasswordConfirmation"
            label="reset.confirm.new.password"
            size="sm"
            gutter={false}
            inputProps={{
              autoComplete: 'reset-password',
              type: 'password',
            }}
            dataCy={'newPasswordConfirmation'}
            validate={validator(required)}
            lpignore={false}
          />
          <SubmitButton
            asyncState={asyncState}
            label={'reset.password'}
            className={classes.submit}
            dataCy={'resetButtonSubmit'}
          />
        </Form>
      </Paper>
    </div>
  );
};

export default ResetPasswordPresenter;
