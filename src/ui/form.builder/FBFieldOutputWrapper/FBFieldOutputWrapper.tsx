import { Box } from '@material-ui/core';
import React from 'react';
import useStyles from './FBFieldOutputWrapper.styles';
import { FBFieldOutputWrapperProps } from './FBFieldOutputWrapper.types';
import { withFBFieldOutputWrapper } from './FBFieldOutputWrapper.wrap';
import cx from 'classnames';

const FBFieldOutputWrapper: React.FunctionComponent<FBFieldOutputWrapperProps> = ({
  mt,
  mb,
  name,
  children,
}) => {
  const classes = useStyles({ mt, mb });
  const inlineStyle = ['lhrs-start-quantity', 'lhrs-accepted-quantity', 'lhrs-rejected-quantity'].includes(name ?? '');

  return (
    <Box className={cx(classes.root, { [classes.inlineStyle]: inlineStyle })} >
      {children}
    </Box>
  );
};

export default withFBFieldOutputWrapper(FBFieldOutputWrapper);
