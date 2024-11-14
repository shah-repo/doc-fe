import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './Alert.styles';
import { AlertDialogProps } from './Alert.types';
import Dialog from './Dialog';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const AlertDialog: React.FC<AlertDialogProps> = ({
  handler,
  loading,
  children,
  hideCloseButton = true,
  isCancelButtonHidden = false,
  cancelLabel = 'common.cancel',
  confirmLabel = 'common.yes.im.sure',
  onClose = handler.close,
  onCancel = handler.close,
  title = 'common.alert',
  warning = false,
  icon,
  iconClass,
  ...props
}) => {
  const classes = useStyles();
  const warningIcon: IconProp = warning ? regular('circle-exclamation') : regular('triangle-exclamation');
  const iconWarningClass = warning ? classes.iconWarning : classes.iconError;

  return (
    <Dialog
      {...props}
      className={classes.root}
      open={handler.isOpen}
      hideCloseButton={hideCloseButton}
      loading={loading}
      cancelLabel={isCancelButtonHidden ? undefined : cancelLabel}
      confirmLabel={confirmLabel}
      confirmProps={{
        id: 'dialog-continue',
        'data-cy': 'dialog-continue',
        ...props.confirmProps,
        disabled: loading,
      }}
      cancelProps={{
        id: 'dialog-cancel',
        'data-cy': 'dialog-cancel',
        ...props.cancelProps,
      }}
      PaperProps={{
        id: 'dialog',
        ...props.PaperProps,
      }}
      onClose={onClose}
      onCancel={onCancel}
    >
      <Box className={classes.content}>
        <Box className={classes.iconWrapper}>
          <FontAwesomeIcon
            icon={icon ?? warningIcon}
            className={iconClass ?? iconWarningClass}
          />
        </Box>
        <Box className={classes.contentWrapper}>
          <Typography variant="h3" data-cy="dialog-header" className={classes.title}>
            {translate(title)}
          </Typography>
          {children}
        </Box>
      </Box>
    </Dialog>
  );
};

export default withThemeNext(AlertDialog);
