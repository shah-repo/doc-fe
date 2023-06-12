import { Box, Button } from '@material-ui/core';
import React from 'react';
import Text from '../../../components/Text';
import { FBButtonProps } from '../../types/button';
import styles from './FBButton.styles';

const FBButton: React.FunctionComponent<FBButtonProps> = ({
  label = '',
  variant = 'contained',
  color = 'secondary',
  buttonType = 'button',
  ...props
}) => {
  const classes = styles();
  return (
    <Box component="span" pb={0.5}>
      <Button
        {...{ color, variant }}
        {...props}
        type={buttonType}
        id="FBButton-label"
        data-cy="FBButton-label"
        className={classes.root}
      >
        <Text message={label} />
      </Button>
    </Box>
  );
};

export default FBButton;
