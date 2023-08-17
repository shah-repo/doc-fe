import { Box, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestDependentOnDocRevsState, ChangeRequestEditRequestBody, DependedDocRevDetails } from '../../../state/ducks/changeRequest/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { Button, Checkbox } from '../../components/forms/fields-next';
import Text from '../../components/Text';
import { FB } from '../../form.builder';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import useStyles from './dialog.styles';

interface Props {
  changeRequest: ChangeRequest | undefined
  details: ChangeRequestDependentOnDocRevsState
  dialog: DialogHandler
  closeAction?: () => void
  confirmLabel?: Translation
  cancelLabel?: Translation
}

const DependentOnDocRevsDialog: React.FunctionComponent<Props> = ({
  changeRequest,
  details,
  dialog,
  closeAction = dialog.close,
  confirmLabel = 'common.continue',
  cancelLabel = 'common.cancel',
}) => {
  const classes = useStyles();

  let docRevsSelected: DependedDocRevDetails[] = [];

  const async = useAsync<ChangeRequest>({
    onSuccess: () => dialog.close,
  });

  const saveChangeRequest = useActionCreator(changeRequestsActions.save);

  const handleDocRevSelection = (isChecked: boolean, docRevChecked: DependedDocRevDetails) => {
    if (isChecked) {
      docRevsSelected.push(docRevChecked);
    } else {
      docRevsSelected = docRevsSelected.filter((docRev) => docRev.id !== docRevChecked.id);
    }
  };

  const addToChangeRequest = () => {
    const crFormInput = changeRequest?.formInput;
    console.log(changeRequest);

    // const formStateContext = FBFormStateContext as any;
    // const formInput = formStateContext?._currentValue;

    if (docRevsSelected.length > 0) {
      // Update FormInput - documentRevisions list with the ones selected
      if (crFormInput && 'documentRevisions' in crFormInput) {
        crFormInput.documentRevisions.push(
          ...docRevsSelected.map(docRevSelected => ({
            descriptionOfChange: '',
            justificationOfChange: '',
            id: FB.uniqid,
            proposedDocumentRevision: {
              id: docRevSelected.id,
            },
          }),
          ));

        async.reset();

        async.start(
          saveChangeRequest,
          changeRequest?.id,
          { formInput: crFormInput } as ChangeRequestEditRequestBody,
          async,
        );
      }
    }
  };

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
      open={dialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="dependent-on-docRevs-dialog"
    >
      <DialogTitle style={{ display: 'flex' }} disableTypography>
        <Typography className={classes.heading}>
          <Text translation="change.request.dependent.docs.dialog.title" />
        </Typography>
        <IconButton
          className={classes.close}
          size="small"
          onClick={closeAction}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers
        id="dependent-on-docRevs-content"
      >
        <div>
          <h3>Action needed on {details.itemsPending} item{details.itemsPending > 1 ? 's' : ''}</h3>
          <p>Add these to this Change Request Or to a separate one.</p>
          {
            Object.keys(details.draftItemsMap).map((key: string) => {
              return (
                <div key={key}>
                  <h4 className={classes.parentRevHeading}>{details.parentDetails[key]}</h4>
                  <ul className={classes.list}>
                    {
                      details.draftItemsMap[key].map((value) => {
                        return (
                          <li key={value.id} className={classes.listItem}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={value.status !== DocumentRevisionStatus.Draft}
                                  onClick={e => handleDocRevSelection(e.target.checked, value)}
                                  // onChange={handleDocRevSelection}
                                  name={value.id}
                                  color="primary"
                                  className={classes.check}
                                />
                              }
                              label={<Text message={`${value.name} - Rev ${value.version} - ${value.status}`} />}
                            />
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              );
            })
          }
        </div>
      </DialogContent>
      <Box className={classes.dialogAction}>
        <Button
          variant="contained"
          className={`${classes.cancelButton} ${classes.buttonLabel}`}
          onClick={closeAction}
          id="DependentOnDialog-cancelButton"
          data-cy="DependentOnDialog-cancelButton"
        >
          <Text translation={cancelLabel} />
        </Button>
        <Button
          type="submit"
          variant="contained"
          className={`${classes.submitButton} ${classes.buttonLabel}`}
          id="DependentOnDialog-addButton"
          data-cy="DependentOnDialog-addButton"
          onClick={addToChangeRequest}
        >
          <Text translation={confirmLabel} />
        </Button>
      </Box>
    </Dialog>
  );
};

export default DependentOnDocRevsDialog;
