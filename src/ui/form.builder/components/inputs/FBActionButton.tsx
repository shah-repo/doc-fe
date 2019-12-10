import { Button, Box } from '@material-ui/core';
import React from 'react';
// import Text from "../../../components/Text";
import { FBButtonProps } from '../../types/button';
import _ from 'lodash';

const FBActionButton: React.FunctionComponent<FBButtonProps> = ({
  label,
  variant = 'contained',
  color = 'secondary',
  disabled,
  action,
  ...props
}) => {
  const onClick = () => {
    // action && FBAction[action](prerequestedValues || {});
  };

  return (
    <Box mt={-3}>
      <Button {...{ variant, color, disabled, onClick }}>
        {/* <Text message={_.get(FBActionType, action || "")} /> */}
        button
      </Button>
    </Box>
  );
};

export default FBActionButton;
