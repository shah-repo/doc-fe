import { Box } from '@material-ui/core';
import React from 'react';
import { FBSubmitButton } from '../..';
import { StyledCancelFBButton } from '../../FBButton/StyledCancelFBButton';
import { FBPOApprovalMatrixFormActionsProps } from '../FBPOApprovalMatrix.types';
import { withFBPOApprovalMatrixForm } from './FBPOApprovalMatrixForm.wrap';

const FBPOApprovalMatrixFormActions: React.FunctionComponent<FBPOApprovalMatrixFormActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={handleAdd}
      autoFocus
    />
    <StyledCancelFBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBPOApprovalMatrixForm(FBPOApprovalMatrixFormActions);
