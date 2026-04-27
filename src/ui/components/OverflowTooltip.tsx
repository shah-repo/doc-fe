import { Tooltip, TooltipProps, makeStyles, withStyles } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import useOverflow from '../hooks/useOverflow';
import { Colors } from '../layout/theme-next';

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

const CustomTooltip = withStyles({
  tooltip: {
    backgroundColor: Colors.black,
    color: Colors.white,
    fontSize: 12,
  },
  arrow: {
    color: Colors.black,
  },
})(Tooltip);

interface Props extends Omit<TooltipProps, 'children'> {
  maxLines?: number
  wrapperClassName?: string
  forceTooltip?: boolean
}

const OverflowTooltip: React.FC<Props> = ({
  title,
  children,
  maxLines = 1,
  forceTooltip,
  wrapperClassName,
  ...props
}) => {
  const [overflowRef, isOverflowing] = useOverflow<HTMLDivElement>();
  const classes = useStyles({ maxLines });

  return (
    <CustomTooltip
      {...props}
      title={isOverflowing || forceTooltip ? title : ''}
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
    </CustomTooltip>
  );
};

export default OverflowTooltip;
