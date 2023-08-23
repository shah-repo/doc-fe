import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Dialog, DialogContent, DialogContentText, FormControlLabel, Grid, Typography } from '@material-ui/core';
import { each, find, isEmpty, unionBy } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
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

  const handleDocRevSelectionAll = (flag: boolean) => {
    console.log('All cliked', flag);
    if (flag) {
      each(details.draftItemsMap, (value) => {
        docRevsSelected = unionBy(docRevsSelected, value, 'id');
      });
    } else {
      docRevsSelected = [];
    }
    console.log('docRevsSelected :', docRevsSelected);
  };
  console.log('details.draftItemsMap :', details.draftItemsMap);

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
      maxWidth="sm"
      open={dialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="dependent-on-doc-revs-dialog"
    >
      <DialogContent dividers
        id="dependent-on-doc-revs-content"
      >
        <DialogContentText>
          <Grid container className={classes.contentContainer}>
            <Grid item className={classes.alertIcon}>
              <FontAwesomeIcon className={classes.infoIcon} color="primary" icon={solid('circle-exclamation')} />
            </Grid>
            <Grid item >
              <Typography data-cy="dialog-header" className={classes.alertTitle}>
                {translate('bom.ar.child.draft.add.action.message', { itemsPending: details.itemsPending })}{details.itemsPending > 1 ? 's' : ''}
              </Typography>
              <Typography data-cy="dialog-message" className={classes.contentText}>
                {translate('bom.ar.child.draft.add.message')}
              </Typography>
              {
                Object.keys(details.draftItemsMap).map((key: string) => {
                  return (
                    <div key={key}>
                      <ul className={classes.list}>
                        <li className={classes.parentListItem}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick= {e => handleDocRevSelectionAll(e.target.checked)}
                                color="primary"
                                className={classes.check}
                              />
                            }
                            label={translate('common.all')}
                          />
                        </li>
                        {
                          details.draftItemsMap[key].map((value) => {
                            const isObjectSelected = isEmpty(find(docRevsSelected, value));
                            console.log('isObjectSelected ,', isObjectSelected, value);
                            return (
                              <li key={value.id} className={classes.listItem}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      disabled={value.status !== DocumentRevisionStatus.Draft}
                                      onClick={e => handleDocRevSelection(e.target.checked, value)}
                                      // onChange={handleDocRevSelection}
                                      checked={!isObjectSelected}
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
            </Grid>
          </Grid>
        </DialogContentText>
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
