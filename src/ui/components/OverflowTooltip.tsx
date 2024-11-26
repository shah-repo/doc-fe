import { Tooltip, TooltipProps, makeStyles } from '@material-ui/core';
import cx from 'classnames';
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
  wrapperClassName?: string
}

const OverflowTooltip: React.FC<Props> = ({
  title,
  children,
  maxLines = 1,
  wrapperClassName,
  ...props
}) => {
  const [overflowRef, isOverflowing] = useOverflow<HTMLDivElement>();
  const classes = useStyles({ maxLines });

  return (
    <Tooltip
      {...props}
      title={isOverflowing ? title : ''}
    >
      <div
        className={cx(
          wrapperClassName,
          {
            [classes.multilineWrapper]: maxLines > 1,
            [classes.wrapper]: maxLines <= 1,
          },
        )}
        ref={overflowRef}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltip;
