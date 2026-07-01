import { Box } from '@material-ui/core';
import React from 'react';
import { FBSubmitButton } from '..';
import { StyledCancelFBButton } from '../FBButton/StyledCancelFBButton';
import { FBApprovalPasswordFormProps } from './FBApprovalPasswordForm.types';

const FBApprovalPasswordFormActions: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  onDialogApprove,
  onDialogReject,
  onDialogClose,
}) => (
  <Box display="flex" justifyContent="center">
    <StyledCancelFBButton
      variant="outlined"
      onClick={onDialogClose}
      label="common.cancel"
    />
    {onDialogApprove && <FBSubmitButton
      variant="contained"
      label="common.confirm"
      onClick={onDialogApprove}
    />}
    {onDialogReject && <FBSubmitButton
      variant="contained"
      label="common.reject"
      onClick={onDialogReject}
    />}
  </Box>
);

export default FBApprovalPasswordFormActions;
