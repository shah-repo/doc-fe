import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';
import Text from '../../../../components/Text';
import useStyles from './styles';

interface Props {
  isOpen: boolean
  closeDialog: () => void
}

const SyncMessageDialog: React.FC<Props> = ({
  isOpen,
  closeDialog,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={isOpen}
      scroll="paper">
        <DialogTitle className={classes.dialogTitle}>
          <FontAwesomeIcon className={classes.infoIcon} icon={regular('circle-info')} />
        <Typography className={classes.titleText}>
          <Text translation="administration.general.settings.approvalRoles.sync.message.dialog.title" />
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Text translation="administration.general.settings.approvalRoles.sync.message.dialog.content" />
        <div className={classes.bottomText}>
        <Text translation="administration.general.settings.approvalRoles.sync.message.dialog.content.bottom" />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          <Text translation="common.ok" />
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default SyncMessageDialog;
