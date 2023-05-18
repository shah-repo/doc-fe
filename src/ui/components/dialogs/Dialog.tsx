import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DialogActions, DialogContent, DialogTitle, LinearProgress, Dialog as MuiDialog, Typography, useMediaQuery } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { themeNext, withThemeNext } from '../../layout/theme-next';
import Text from '../Text';
import { Button, IconButton } from '../forms/fields-next';
import { renderNode } from '../forms/fields-next/utils';
import useStyles from './Dialog.styles';
import { DialogActionsProps, DialogCloseReason, DialogProps } from './Dialog.types';

const DefaultDialogActions: React.FC<DialogActionsProps> = ({
  confirmLabel,
  confirmProps,
  onConfirm,
  cancelLabel,
  cancelProps,
  onCancel,
}) => (
  <>
    {cancelLabel && (
      <Button kind={cancelProps?.kind ?? 'ghost'} {...cancelProps} onClick={onCancel}>
        {renderNode(cancelLabel)}
      </Button>
    )}
    {confirmLabel && (
      <Button {...confirmProps} onClick={onConfirm}>
        {renderNode(confirmLabel)}
      </Button>
    )}
  </>
);

const Dialog: React.FC<DialogProps> = ({
  breakpoint = 'xs',
  classes: dialogClasses,
  title,
  className,
  loading,
  hideCloseButton,
  children,
  actions,
  actionsRef,
  confirmLabel,
  cancelLabel,
  confirmProps,
  cancelProps,
  titleProps,
  contentProps = { dividers: true },
  actionsProps,
  onConfirm,
  onCancel,
  onClose,
  onSubmit,
  ...props
}) => {
  const classes = useStyles({ dividers: contentProps.dividers });
  const isFullScreen = useMediaQuery(themeNext.breakpoints.down(breakpoint));

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const handleClose = (eventName: DialogCloseReason) =>
    (event: React.MouseEvent<HTMLButtonElement>) => onClose?.(event, eventName);

  const shouldDisplayActions = actions || confirmLabel || cancelLabel || actionsRef;

  return (
    <MuiDialog
      {...props}
      fullScreen={isFullScreen}
      onClose={(event, reason) => onClose?.(event, reason as DialogCloseReason)}
      onSubmit={onSubmit ?? preventPropagation}
      classes={{
        paper: className,
        ...dialogClasses,
      }}
    >
      {!hideCloseButton && (
        <IconButton kind="action" className={classes.close} onClick={handleClose(DialogCloseReason.CLOSE_CLICK)}>
          <FontAwesomeIcon icon={regular('xmark')} />
        </IconButton>
      )}
      {title && (
        <DialogTitle
          {...titleProps}
          className={cx(titleProps?.className, classes.title, { [classes.titleWithClose]: !hideCloseButton })}
        >
          {
            typeof title === 'string'
              ? <Typography variant="caption"><Text message={title} /></Typography>
              : title
          }
          {loading && <LinearProgress className={classes.loading} />}
        </DialogTitle>
      )}
      {!title && loading && <LinearProgress className={cx(classes.loading, classes.loadingAtTop)} />}
      <DialogContent
        {...contentProps}
        className={cx(contentProps.className, classes.content)}
      >
        {children}
      </DialogContent>
      {shouldDisplayActions && (
        <DialogActions {...actionsProps} ref={actionsRef}>
          {actions ?? (!actionsRef && (
            <DefaultDialogActions
              {...{ cancelLabel, confirmLabel, confirmProps, cancelProps, onConfirm }}
              onCancel={onCancel ?? handleClose(DialogCloseReason.CANCEL_CLICK)}
            />
          ))}
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default withThemeNext(Dialog);
