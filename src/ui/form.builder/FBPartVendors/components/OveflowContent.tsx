import { Box } from '@material-ui/core';
import React from 'react';
import OverflowTooltip from '../../../components/OverflowTooltip';

interface Props {
  onClick?: () => void
}

const OverflowingContent: React.FC<Props> = ({ children, onClick }) => (
  <Box onClick={onClick}>
    <OverflowTooltip
      title={children}
      placement="top"
      interactive
      arrow
    >
      {children}
    </OverflowTooltip>
  </Box>
);

export default OverflowingContent;
