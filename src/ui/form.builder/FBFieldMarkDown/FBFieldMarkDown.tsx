import { Box, Divider } from '@material-ui/core';
import React from 'react';
import { FBFieldMarkDownProps } from '..';
import { withFBFieldMarkDown } from './FBFieldMarkDown.wrap';

const FBFormMarkDown: React.FunctionComponent<FBFieldMarkDownProps> = ({
  source = '',
  ...props
}) => (
  <Box {...props} my={2}>
    <Divider />
    <Box px={2}>
      <code>
        <pre>{source}</pre>
      </code>
    </Box>
  </Box>
);

export default withFBFieldMarkDown(FBFormMarkDown);
