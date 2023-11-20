import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import TreeCreator from '../../form.builder/FBBOM/components/treelist/TreeCreator';
import { DialogHandler } from '../../hooks/useDialog';
import Text from '../Text';
import LotWhereUsedTreeCreator from './LotWhereUsedTree';
import useStyles from './WhereUsedDialog.styles';

export enum WhereUsedType {
  PART = 'part',
  LOT = 'lot',
}

interface Props {
  revId: string
  whereUsedDialog: DialogHandler
  closeDialog: () => void
  type: WhereUsedType
}

const WhereUsedDialog: React.FunctionComponent<Props> = ({
  revId,
  whereUsedDialog,
  closeDialog,
  type,
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
        { type === WhereUsedType.PART && <TreeCreator docRevId={revId} /> }
        { type === WhereUsedType.LOT && <LotWhereUsedTreeCreator lotRevId={revId} /> }
      </DialogContent>
    </Dialog>
  );
};

export default WhereUsedDialog;
