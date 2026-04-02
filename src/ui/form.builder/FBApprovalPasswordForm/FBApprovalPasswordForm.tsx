import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { FBForm, FBTextField } from '..';
import { store } from '../../../state/store';
import { Autocomplete } from '../../components/forms/fields-next';
import Text from '../../components/Text';
import { useStyle } from './FBApprovalPasswordForm.styles';
import { FBApprovalPasswordFormProps } from './FBApprovalPasswordForm.types';
import { withFBApprovalPasswordForm } from './FBApprovalPasswordForm.wrap';

const FBApprovalPasswordForm: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  formState,
  isApproverVisible = false,
  children,
}) => {
  // Prevent form submitting.
  const submitHandler: React.FormEventHandler = React.useCallback(
    (event) => event.preventDefault(),
    [],
  );
  const classes = useStyle();
  const { name } = store.getState().auth.user;

  return (
    <FBForm {...{ formState }}>
      {/* Isolate autocomplete triggering in current form */}
      <form autoComplete="off" onSubmit={submitHandler}>
        {!isApproverVisible && <Box className={classes.labelContainer}>
          <Typography className={classes.label}>
            <Text translation="common.approvers" />
          </Typography>
          <Autocomplete
            disabled
            value={{ label: name, value: name }}
            getOptionLabel={(option) => option.label}
          />
        </Box>}
        <FBTextField
          rules="required"
          name="password"
          inputProps={{
            type: 'password',
          }}
          label="form.builder.password"
        />
        <Box display="flex" justifyContent="center" mx={0}>
          {children}
        </Box>
      </form>
    </FBForm>
  );
};

export default withFBApprovalPasswordForm(FBApprovalPasswordForm);
