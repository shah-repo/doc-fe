import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { Dam } from '../../../../../state/ducks/company/types';
import Text from '../../../../components/Text';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useStyles from './styles';

interface Props {
  isOpen: boolean
  dam: Dam
  closeDialog: () => void
  dialogContent?: JSX.Element
}

const SyncMessageDialog: React.FC<Props> = ({
  isOpen,
  dam,
  closeDialog,
  dialogContent,
}) => {
  const classes = useStyles();
  const url = documentVersionPath(dam?.documentRevision?.id ?? '', dam?.document?.id ?? '');
  const label = translate('administration.general.settings.approvalRoles.sync.message.dialog.doc.name',
  { docId: dam?.document?.docId, rev: dam?.documentRevision?.displayRevision, status: dam.documentRevision.displayStatus });

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
        {(
          dialogContent
          ?? <>
          <Text translation="administration.general.settings.approvalRoles.sync.message.dialog.content" />
        <Link
        to={url}
        className={classes.link}>
          &nbsp;{label}
        </Link>
        <div className={classes.bottomText}>
        <Text translation="administration.general.settings.approvalRoles.sync.message.dialog.content.bottom" />
        </div>
        </>
        )}
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button onClick={closeDialog} className={classes.okBtn}>
          <Text translation="common.ok" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SyncMessageDialog;
