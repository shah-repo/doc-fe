import { Box } from '@material-ui/core';
import React from 'react';
import { FBSubmitButton, FBWorkspaceTplActionsProps } from '..';
import { StyledCancelFBButton } from '../FBButton/StyledCancelFBButton';
import { withFBWorkspaceTplActions } from './FBWorkspaceTplActions.wrap';

const FBWorkspaceTplActions: React.FunctionComponent<FBWorkspaceTplActionsProps> = ({
  handleCancel,
  handleTplName,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={handleTplName}
      autoFocus
    />
    <StyledCancelFBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBWorkspaceTplActions(FBWorkspaceTplActions);
