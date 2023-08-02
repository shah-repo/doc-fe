import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import OverflowTooltip from '../../../components/OverflowTooltip';
import useStyles from '../styles';

interface Props {
  onClick?: () => void
}

const OverflowingContent: React.FC<Props> = ({ children, onClick }) => {
  const classes = useStyles();

  return (
    <Box onClick={onClick}>
      <OverflowTooltip
        title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{children}</div>}
        placement="top"
        interactive
        arrow
      >
        {children}
      </OverflowTooltip>
    </Box>
  );
};

export default OverflowingContent;
