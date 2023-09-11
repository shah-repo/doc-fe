import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { translate } from '../../../common/intl';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import {
  ChangeRequest,
  ChangeRequestDependentOnDocRevsState,
  ChangeRequestEditRequestBody,
  DependedDocRevDetails,
} from '../../../state/ducks/changeRequest/types';
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
  closeAction,
  confirmLabel = 'common.continue',
  cancelLabel = 'common.cancel',
}) => {
  const classes = useStyles();

  const [selectAll, setSelectAll] = useState(false);
  const [docRevs, setDocRevs] = useState(
    Object.values(details.draftItemsMap)
      .flat()
      .map((item) => {
        return {
          ...item,
          isChecked: false,
        };
      }),
  );

  const async = useAsync<ChangeRequest>({
    onSuccess: () => dialog.close(),
  });

  const saveChangeRequest = useActionCreator(changeRequestsActions.save);

  const handleDocRevSelection = (
    isChecked: boolean,
    docRevChecked: DependedDocRevDetails,
  ) => {
    const updatedDocRevs = docRevs.map((docRev) =>
      docRev.id === docRevChecked?.id ? { ...docRev, isChecked } : docRev,
    );
    setDocRevs(updatedDocRevs);
    const allChecked = updatedDocRevs.every((docRev) => docRev.isChecked);
    setSelectAll(allChecked);
  };

  const handleDocRevSelectionAll = (isChecked: boolean) => {
    setSelectAll(isChecked);
    const updatedDocRevs = docRevs.map((docRev) => ({
      ...docRev,
      isChecked,
    }));
    setDocRevs(updatedDocRevs);
  };

  const addToChangeRequest = () => {
    const crFormInput = changeRequest?.formInput;
    const docRevsSelected = docRevs.filter((docRev) => docRev.isChecked);
    if (docRevsSelected.length > 0) {
      // Update FormInput - documentRevisions list with the ones selected
      if (crFormInput && 'documentRevisions' in crFormInput) {
        crFormInput.documentRevisions.push(
          ...docRevsSelected.map((docRevSelected) => ({
            descriptionOfChange: '',
            justificationOfChange: '',
            id: FB.uniqid,
            proposedDocumentRevision: {
              id: docRevSelected.id,
            },
          })),
        );
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
      <DialogContent dividers id="dependent-on-doc-revs-content">
        <DialogContentText>
          <Grid container className={classes.contentContainer}>
            <Grid item className={classes.alertIcon}>
              <FontAwesomeIcon
                className={classes.infoIcon}
                color="primary"
                icon={regular('circle-exclamation')}
              />
            </Grid>
            {details.itemsInDraft > 0
              && <Grid item>
                <Typography
                  data-cy="dialog-header"
                  className={classes.alertTitle}
                >
                  {translate('bom.ar.child.draft.add.action.message', {
                    itemsRequiringAttention: details.itemsInDraft,
                  })}
                  {details.itemsInDraft > 1 ? 's' : ''}
                </Typography>
                <Typography
                  data-cy="dialog-message"
                  className={classes.contentText}
                >
                  {translate('bom.ar.child.draft.add.message')}
                </Typography>
                <ul className={classes.parentList}>
                  <li className={classes.parentListItem}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) =>
                            handleDocRevSelectionAll(e.target.checked)
                          }
                          classes={{
                            root: classes.checkbox,
                            checked: classes.checked,
                          }}
                          checked={selectAll}
                          className={classes.check}
                        />
                      }
                      label={translate('common.select.all')}
                    />
                  </li>
                  <div className={classes.list}>
                    {docRevs.map((value) => {
                      return (
                        <li key={value.id} className={classes.listItem}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value.isChecked ?? false}
                                classes={{
                                  root: classes.checkbox,
                                  checked: classes.checked,
                                }}
                                disabled={
                                  value.status !== DocumentRevisionStatus.Draft
                                }
                                onChange={(e) =>
                                  handleDocRevSelection(e.target.checked, value)
                                }
                                name={value.id}
                                className={classes.check}
                              />
                            }
                            label={
                              <Grid
                                container
                                wrap="nowrap"
                                justify="flex-start"
                                alignItems="center"
                              >
                                <Grid item>
                                  {value.docId}
                                </Grid>
                                <Grid item className={classes.dotContainer}>
                                  <Box className={classes.blackDot} />
                                </Grid>
                                <Grid item className={classes.timestampContainer}>
                                  {translate('bom.ar.child.draft.option', { revision: value.displayRevision, title: value.name })}
                                </Grid>
                              </Grid>
                            }
                          />
                        </li>
                      );
                    })}
                  </div>
                </ul>
              </Grid>
            }
            {details.itemsInDraft === 0 && details.itemsPending > 0
              && <Grid item>
                <Typography
                  data-cy="dialog-header"
                  className={classes.alertTitle}
                >
                  {translate('bom.ar.child.draft.add.action.message', {
                    itemsRequiringAttention: details.itemsPending,
                  })}
                  {details.itemsPending > 1 ? 's' : ''}
                </Typography>
                <Typography
                  data-cy="dialog-message"
                  className={classes.contentText}
                >
                  {translate('bom.ar.child.pending.message')}
                </Typography>
                <ul className={classes.list}>
                  {Object.values(details.blockingItemsMap).flat().map((value) => {
                    return (
                      <li key={value.id} className={classes.listItem}>
                        <Grid container
                          wrap="nowrap"
                          justify="flex-start"
                          alignItems="center"
                        >
                          <Grid item>
                            {value.docId}
                          </Grid>
                          <Grid item className={classes.dotContainer}>
                            <Box className={classes.blackDot} />
                          </Grid>
                          <Grid item className={classes.timestampContainer}>
                            {translate('bom.ar.child.draft.option', { revision: value.displayRevision, title: value.name })}
                          </Grid>
                        </Grid>
                      </li>
                    );
                  })}
                </ul>
              </Grid>
            }
            {details.itemsInDraft === 0 && details.itemsPending === 0 && details.itemsInvalid > 0
              && <Grid item>
                <Typography
                  data-cy="dialog-header"
                  className={classes.alertTitle}
                >
                  {translate('bom.ar.child.draft.add.action.message', {
                    itemsRequiringAttention: details.itemsInvalid,
                  })}
                  {details.itemsInvalid > 1 ? 's' : ''}
                </Typography>
                <Typography
                  data-cy="dialog-message"
                  className={classes.contentText}
                >
                  {translate('bom.ar.child.invalid.message', {
                    obsolete: DocumentRevisionStatus.Obsolete, void: DocumentRevisionStatus.Voided,
                  })}
                </Typography>
                <ul className={classes.list}>
                  {Object.values(details.itemsInvalidMap).flat().map((value) => {
                    return (
                      <li key={value.id} className={classes.listItem}>
                        <Grid container
                          wrap="nowrap"
                          justify="flex-start"
                          alignItems="center"
                        >
                          <Grid item>
                            {value.docId}
                          </Grid>
                          <Grid item className={classes.dotContainer}>
                            <Box className={classes.blackDot} />
                          </Grid>
                          <Grid item className={classes.timestampContainer}>
                            {translate('bom.ar.child.draft.option', { revision: value.displayRevision, title: value.name })}
                          </Grid>
                        </Grid>
                      </li>
                    );
                  })}
                </ul>
              </Grid>
            }
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
        { details.itemsInDraft > 0 && <Button
          type="submit"
          variant="contained"
          className={`${classes.submitButton} ${classes.buttonLabel}`}
          id="DependentOnDialog-addButton"
          data-cy="DependentOnDialog-addButton"
          onClick={addToChangeRequest}
        >
          <Text translation={confirmLabel} />
        </Button> }
      </Box>
    </Dialog>
  );
};

export default DependentOnDocRevsDialog;
