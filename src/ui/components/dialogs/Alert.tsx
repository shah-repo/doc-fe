import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './Alert.styles';
import { AlertDialogProps } from './Alert.types';
import Dialog from './Dialog';

const AlertDialog: React.FC<AlertDialogProps> = ({
  handler,
  loading,
  children,
  hideCloseButton = true,
  cancelLabel = 'common.cancel',
  confirmLabel = 'common.yes.im.sure',
  onClose = handler.close,
  onCancel = handler.close,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Dialog
      {...props}
      className={classes.root}
      open={handler.isOpen}
      hideCloseButton={hideCloseButton}
      loading={loading}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      confirmProps={{
        disabled: loading,
      }}
      onClose={onClose}
      onCancel={onCancel}
    >
      <Box className={classes.content}>
        <Box className={classes.iconWrapper}>
          <FontAwesomeIcon
            icon={regular('triangle-exclamation')}
            className={classes.icon}
          />
        </Box>
        <Box className={classes.contentWrapper}>
          <Typography variant="h3" className={classes.title}>
            {translate('common.alert')}!
          </Typography>
          {children}
        </Box>
      </Box>
    </Dialog>
  );
};

export default withThemeNext(AlertDialog);
