import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import Text from '../../../../components/Text';
import { DialogHandler } from '../../../../hooks/useDialog';
import TreeCreator from './TreeCreator';
import useStyles from './WhereUsedDialog.styles';

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
      disableBackdropClick
      disableEnforceFocus
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      scroll="paper"
      disableEscapeKeyDown
      maxWidth={false}
      open={whereUsedDialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="WhereUsed-dialog"
    >
      <DialogTitle className={classes.title} disableTypography>
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
