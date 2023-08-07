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
    <OverflowTooltip
      title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{children}</div>}
      placement="top"
      interactive
      arrow
      onClick={onClick}
    >
      {children}
    </OverflowTooltip>
  );
};

export default OverflowingContent;
