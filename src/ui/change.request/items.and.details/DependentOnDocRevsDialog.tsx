import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { ChangeRequestDependentOnDocRevsState } from '../../../state/ducks/changeRequest/types';
import Text from '../../components/Text';
import { DialogHandler } from '../../hooks/useDialog';
import useStyles from './dialog.styles';

interface Props {
  details: ChangeRequestDependentOnDocRevsState
  dependentOnDocRevsDialog: DialogHandler
  closeDialog: () => void
}

const DependentOnDocRevsDialog: React.FunctionComponent<Props> = ({
  details,
  dependentOnDocRevsDialog,
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
      open={dependentOnDocRevsDialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="dependent-docRevs-dialog"
    >
      <DialogTitle style={{ display: 'flex' }} disableTypography>
        <Typography className={classes.heading}>
          <Text translation="change.request.dependent.docs.dialog.title" />
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
        <span>DocRevs Dependent</span>
        <div>{JSON.stringify(details)}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DependentOnDocRevsDialog;
