import { Box } from '@material-ui/core';
import React from 'react';
import useStyles from './FBFieldOutputWrapper.styles';
import { FBFieldOutputWrapperProps } from './FBFieldOutputWrapper.types';
import { withFBFieldOutputWrapper } from './FBFieldOutputWrapper.wrap';

const FBFieldOutputWrapper: React.FunctionComponent<FBFieldOutputWrapperProps> = ({
  mt,
  mb,
  children,
}) => {
  const classes = useStyles({ mt, mb });

  return (
    <Box className={classes.root}>
      {children}
    </Box>
  );
};

export default withFBFieldOutputWrapper(FBFieldOutputWrapper);
