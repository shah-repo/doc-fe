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

const OveflowTooltip: React.FC<TooltipProps> = ({
  title,
  children,
  ...props
}) => {
  const [overflowRef, isOveflowing] = useOverflow<HTMLDivElement>();
  const classes = useStyles();

  return (
    <Tooltip
      {...props}
      title={isOveflowing ? title : ''}
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

export default OveflowTooltip;
