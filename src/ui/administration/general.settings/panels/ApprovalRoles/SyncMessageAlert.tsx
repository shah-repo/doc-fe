import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';
import Text from '../../../../components/Text';
import useStyles from './styles';

interface Props {
  isOpen: boolean
  dialogContent?: JSX.Element
}

const SyncMessageAlert: React.FC<Props> = ({
  isOpen = false,
  dialogContent,
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
      open={isOpen}
      scroll="paper">
      <DialogTitle className={classes.alertTitle}>
        <FontAwesomeIcon className={classes.alertIcon} icon={regular('triangle-exclamation')} />
        <Typography className={classes.titleText}>
          <Text translation="dam.sync.message.out.of.sync" />
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.alertContent}>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default SyncMessageAlert;
