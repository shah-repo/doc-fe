import { Tooltip, TooltipProps, makeStyles } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { withThemeNext } from '../layout/theme-next';

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
  forceTooltip?: boolean
  children?: React.ReactNode
}

const OverflowTooltip: React.FC<Props> = ({
  title,
  children,
  maxLines = 1,
  forceTooltip,
  onClose,
  onOpen,
  open: openProp,
  wrapperClassName,
  ...props
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isTooltipEnabled, setIsTooltipEnabled] = React.useState(Boolean(forceTooltip));
  const classes = useStyles({ maxLines });

  const checkOverflow = React.useCallback(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return false;
    }

    return maxLines > 1
      ? wrapper.scrollHeight > wrapper.clientHeight || wrapper.scrollWidth > wrapper.clientWidth
      : wrapper.scrollWidth > wrapper.clientWidth;
  }, [maxLines]);

  const handleOpen = React.useCallback((event: React.ChangeEvent<{}>) => {
    const shouldOpen = Boolean(forceTooltip) || checkOverflow();

    setIsTooltipEnabled(shouldOpen);

    if (shouldOpen) {
      setIsOpen(true);
      onOpen?.(event);
    } else {
      setIsOpen(false);
    }
  }, [checkOverflow, forceTooltip, onOpen]);

  const handleClose = React.useCallback((event: React.ChangeEvent<{}>) => {
    setIsOpen(false);
    onClose?.(event);
  }, [onClose]);

  const isEnabled = Boolean(forceTooltip) || isTooltipEnabled;
  const tooltipOpen = (openProp ?? isOpen) && isEnabled;

  return (
    <Tooltip
      {...props}
      onClose={handleClose}
      onOpen={handleOpen}
      open={tooltipOpen}
      title={isEnabled ? title : ''}
    >
      <div
        className={cx(
          wrapperClassName,
          {
            [classes.multilineWrapper]: maxLines > 1,
            [classes.wrapper]: maxLines <= 1,
          },
        )}
        ref={wrapperRef}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default withThemeNext(OverflowTooltip);
