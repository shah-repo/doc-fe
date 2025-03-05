import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';
import { IconButton } from '../../../../../components/forms/fields-next';
import Text from '../../../../../components/Text';
import { DialogHandler } from '../../../../../hooks/useDialog';
import useStyles from '../styles';

interface Props {
  dialogContent?: JSX.Element
  alertDialog: DialogHandler
}

const SyncMessageAlert: React.FC<Props> = ({
  dialogContent,
  alertDialog,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      classes={{
        root: classes.alertRoot,
        paper: classes.alertPaper,
      }}
      hideBackdrop
      disableEnforceFocus
      disableBackdropClick
      style={{ position: 'initial' }}
      maxWidth="sm"
      open={alertDialog.isOpen}
      scroll="paper"
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <FontAwesomeIcon className={classes.alertIcon} icon={regular('triangle-exclamation')} />
        <Typography className={classes.titleText}>
          <Text translation="dam.sync.message.out.of.sync" />
        </Typography>
        <IconButton
          kind="ghost"
          className={classes.closeButton}
          onClick={() => alertDialog.close()}
        >
          <FontAwesomeIcon icon={regular('xmark')} />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.alertContent}>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default SyncMessageAlert;
