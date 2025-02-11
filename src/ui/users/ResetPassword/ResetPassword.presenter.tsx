import { Typography } from '@material-ui/core';
import { Form, useFormikContext } from 'formik';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { AsyncState } from '../../../state/types';
import { Button, FormikField, TextField } from '../../components/forms/fields-next';
import { FormikFieldProps } from '../../components/forms/fields-next/FormikField/FormikField.types';
import { TextFieldProps } from '../../components/forms/fields-next/TextField/TextField.types';
import FormMessage from '../../components/forms/FormMessage';
import { HOME_URL } from '../../constants/urls';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './ResetPassword.styles';

interface Props {
  asyncState: AsyncState
  logo: string
}

const ResetPasswordPresenter: React.FC<Props> = ({
  asyncState,
  logo,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const classes = useStyles();

  const sharedFieldProps: Partial<FormikFieldProps> = {
    required: true,
    labelProps: {
      className: classes.label,
    },
    helperTextProps: {
      className: classes.helper,
    },
  };

  const getSharedInputProps = (autocomplete = 'new-password'): Partial<TextFieldProps> => ({
    type: 'password',
    inputProps: {
      className: classes.field,
      autocomplete,
    },
  });

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.formTitle}>
          <div data-cy="reset-password-title">
            <Typography variant="h1" className={classes.title}>
              {translate('reset.password')}
            </Typography>
          </div>
          <div data-cy="reset-password-subtitle">
            <Typography variant="h4" className={classes.subtitle} >
              {translate('reset.choose.new.password')}
            </Typography>
          </div>
        </div>
        <Form className={classes.form}>
          <FormMessage asyncState={asyncState} />
          <FormikField
            {...sharedFieldProps}
            label="reset.current.password"
            name="currentPassword"
          >
            <TextField
              {...getFieldProps('currentPassword')}
              {...getSharedInputProps('current-password')}
              placeholder={translate('reset.enter.current.password')}
              data-cy="current-password"
            />
          </FormikField>
          <FormikField
            {...sharedFieldProps}
            label="reset.new.password"
            name="newPassword"
          >
            <TextField
              {...getFieldProps('newPassword')}
              {...getSharedInputProps()}
              placeholder={translate('reset.enter.new.password')}
              data-cy="new-password-first-input"
            />
          </FormikField>
          <FormikField
            {...sharedFieldProps}
            label="reset.confirm.new.password"
            name="newPasswordConfirmation"
          >
            <TextField
              {...getFieldProps('newPasswordConfirmation')}
              {...getSharedInputProps()}
              placeholder={translate('reset.enter.new.password')}
              data-cy="new-password-confirmation"
            />
          </FormikField>
          <Button
            type="submit"
            data-cy="reset-button-submit"
            className={classes.submitButton}
          >
            {translate('reset.password')}
          </Button>
        </Form>
        <div className={classes.actions}>
          <Link className={classes.link} to={HOME_URL}>« {translate('reset.back.action')}</Link>
        </div>
      </div>
    </div>
  );
};

export default withThemeNext(ResetPasswordPresenter);
