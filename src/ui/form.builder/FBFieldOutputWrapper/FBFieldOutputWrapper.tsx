import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { LHRS_ACCEPTED_QUANTITY, LHRS_REJECTED_QUANTITY, LHRS_START_QUANTITY } from '../FBLHRStep/utils';
import useStyles from './FBFieldOutputWrapper.styles';
import { FBFieldOutputWrapperProps } from './FBFieldOutputWrapper.types';
import { withFBFieldOutputWrapper } from './FBFieldOutputWrapper.wrap';

const FBFieldOutputWrapper: React.FunctionComponent<FBFieldOutputWrapperProps> = ({
  mt,
  mb,
  name,
  children,
}) => {
  const classes = useStyles({ mt, mb });
  const inlineStyle = [LHRS_START_QUANTITY, LHRS_ACCEPTED_QUANTITY, LHRS_REJECTED_QUANTITY].includes(name ?? '');

  return (
    <Box className={cx(classes.root, { [classes.inlineStyle]: inlineStyle })} >
      {children}
    </Box>
  );
};

export default withFBFieldOutputWrapper(FBFieldOutputWrapper);
