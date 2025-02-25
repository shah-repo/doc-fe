import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Dam } from '../../../../../../state/ducks/company/types';
import Text from '../../../../../components/Text';
import { documentVersionPath } from '../../../../../document.revision/utils/paths';
import useStyles from '../styles';

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
  const damDocId = dam?.document?.docId;

  return (
    <Dialog
      open={isOpen}
      scroll="paper"
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <FontAwesomeIcon className={classes.infoIcon} icon={regular('circle-info')} />
        <Typography className={classes.titleText}>
          <Text translation="administration.general.settings.approvalRoles.sync.message.dialog.title" />
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {dialogContent ?? (
          <>
            <Text translation="administration.general.settings.approvalRoles.sync.message.dialog.content" />
            {damDocId && (
              <>
                {' ('}
                <Link
                  className={classes.link}
                  to={documentVersionPath(dam?.documentRevision?.id ?? '', dam?.document?.id ?? '')}
                  target="_blank"
                >
                  {damDocId}
                </Link>
                ).
              </>
            )}
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
