import { Tooltip, TooltipProps, makeStyles } from '@material-ui/core';
import React from 'react';
import useOverflow from '../hooks/useOverflow';

const useStyles = makeStyles({
  wrapper: {
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
});

const OverflowTooltip: React.FC<Omit<TooltipProps, 'children'>> = ({
  title,
  children,
  ...props
}) => {
  const [overflowRef, isOverflowing] = useOverflow<HTMLDivElement>();
  const classes = useStyles();

  return (
    <Tooltip
      {...props}
      title={isOverflowing ? title : ''}
    >
      <div
        className={classes.wrapper}
        ref={overflowRef}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltip;
