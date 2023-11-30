import { Box } from '@material-ui/core';
import React from 'react';
import OverflowTooltip from './OverflowTooltip';

interface Props {
  title?: React.ReactNode
  onClick?: () => void
}

const OverflowContent: React.FC<Props> = ({ title, children, onClick }) => (
  <Box onClick={onClick}>
    <OverflowTooltip
      title={title ?? children}
      placement="top"
      interactive
      arrow
    >
      {children}
    </OverflowTooltip>
  </Box>
);

export default OverflowContent;
