import { Box } from '@material-ui/core';
import React from 'react';
import { FBProcedureFormActionsProps, FBSubmitButton } from '..';
import { StyledCancelFBButton } from '../FBButton/StyledCancelFBButton';

const FBProcedureFormActions: React.FunctionComponent<FBProcedureFormActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="contained"
      label={'form.builder.save'}
      onClick={handleAdd}
    />
    <StyledCancelFBButton
      variant="outlined"
      label="form.builder.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default FBProcedureFormActions;
