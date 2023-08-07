import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { DialogHandler } from '../../../../hooks/useDialog';
import useStyles from './WhereUsedDialog.styles';
import CloseIcon from '@material-ui/icons/Close';
import TreeCreator from './TreeCreator';
import Text from '../../../../components/Text';
import React from 'react';

interface Props {
  docRevId: string
  whereUsedDialog: DialogHandler
  closeDialog: () => void
}

const WhereUsedDialog: React.FunctionComponent<Props> = ({
  docRevId,
  whereUsedDialog,
  closeDialog,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      disableBackdropClick={true}
      disableEnforceFocus
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      scroll="paper"
      disableEscapeKeyDown={true}
      maxWidth={false}
      open={whereUsedDialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="WhereUsed-dialog"
    >
      <DialogTitle style={{ display: 'flex' }} disableTypography>
        <Typography className={classes.heading}>
          <Text translation="bom.whereUsed.dialog.title" />
        </Typography>
        <IconButton
          className={classes.close}
          size="small"
          onClick={closeDialog}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers
        id="WhereUsed-content"
      >
        <TreeCreator docRevId={docRevId} />
      </DialogContent>
    </Dialog>
  );
};

export default WhereUsedDialog;
