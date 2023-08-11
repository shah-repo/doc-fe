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
  multilineWrapper: ({ maxLines = 2 }: Partial<Props>) => ({
    maxWidth: '100%',
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-line-clamp': maxLines,
    '-webkit-box-orient': 'vertical',
  }),
});

interface Props extends Omit<TooltipProps, 'children'> {
  maxLines?: number
}

const OveflowTooltip: React.FC<Props> = ({
  title,
  children,
  maxLines = 1,
  ...props
}) => {
  const [overflowRef, isOveflowing] = useOverflow<HTMLDivElement>();
  const classes = useStyles({ maxLines });

  return (
    <Tooltip
      {...props}
      title={isOveflowing ? title : ''}
    >
      <div
        className={maxLines > 1 ? classes.multilineWrapper : classes.wrapper}
        ref={overflowRef}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OveflowTooltip;
