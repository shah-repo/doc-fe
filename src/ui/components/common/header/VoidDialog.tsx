import { Box, Button, Dialog, DialogContent, DialogContentText, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as AlertIcon } from "../../../../assets/images/alert.svg";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { POStatusType, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { styles } from "../../../app/alert.dialog/AlertDialog.styles";
import Text from "../../../components/Text";
import { FB, FBFormState, FBProvider, FBSubmitButton, FBTextField } from "../../../form.builder";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { DialogHandler } from "../../../hooks/useDialog";

interface Props {
  dialog: DialogHandler;
  docRevId: string;
  docRevOwner: string;
  updatedAt: string;
}

export const VoidPOStatusDialog: React.FunctionComponent<Props> = ({
  dialog,
  docRevId,
  docRevOwner,
  updatedAt,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const formState = FB.useRef(FBFormState, {});
  const save = useActionCreator(documentRevisionsActions.save);

  const voidDocAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.loadAudit(docRevId));
    },
  });

  const voidRecord = () => {
    // TODO change as per BE
    voidDocAsync.start(
      save,
      docRevId,
      {
        description: `<p>Void</p>
        <p>${formState?.getValues().voidDescription}</p>
        <p>${docRevOwner}, ${updatedAt}</p>`,
        poStatus: POStatusType.VOIDED,
        revisionChangeType: RevisionChangeType.Obsolete,
      },
      voidDocAsync,
    );
  };

  return (
    <>
      { dialog.isOpen && <Dialog
        open={dialog.isOpen}
      >
        <DialogContent>
          <DialogContentText>
            <Grid container className={classes.contentContainer}>
              <Grid item className={classes.alertIcon}>
                <AlertIcon />
              </Grid>
              <Grid item >
                <Typography className={classes.alertTitle}>
                  <Text translation="common.alert" />!
                </Typography>
                <Typography className={classes.contentText}>
                  <Text translation="documentRevision.po.void.alert" />
                </Typography>
              </Grid>
            </Grid>
          </DialogContentText>
          <FBProvider {...{ formState }} >
            <FBTextField
              name="voidDescription"
              label="common.description"
              dataCy="void.record.description"
              rules="required"
              rows={3}
            />
            <Box className={classes.dialogAction}>
              <Button
                variant="contained"
                data-cy="void-cancel-btn"
                className={`${classes.cancelButton} ${classes.buttonLabel}`}
                onClick={() => dialog.close()}
              >
                <Text translation="common.false" />
              </Button>
              <FBSubmitButton
                variant="contained"
                data-cy="void-submit-btn"
                className={`${classes.submitButton} ${classes.buttonLabel}`}
                label="common.true"
                onClick={voidRecord}
              />
            </Box>
          </FBProvider>
        </DialogContent>
      </Dialog>}
    </>
  );
};
