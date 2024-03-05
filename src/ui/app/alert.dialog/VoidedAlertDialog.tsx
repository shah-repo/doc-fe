import { Box, Button, Dialog, DialogContent, DialogContentText, Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as AlertIcon } from '../../../assets/images/alert.svg';
import { MomentFormats, TIME_ZONE } from '../../../common/utils/date';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import Text from '../../components/Text';
import { FB, FBFormState, FBProvider, FBSubmitButton, FBTextField } from '../../form.builder';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import { styles } from './AlertDialog.styles';
interface Props {
  confirmAction: (values?) => void
  cancelAction?: (e: React.MouseEvent<HTMLElement>) => void
  message: Translation
  dialog: DialogHandler
  confirmLabel?: Translation
  cancelLabel?: Translation
  docRevId: string
  docRevOwner: string
}
/** Dialog with Confirm and Cancel buttons.
 * @param dialog Dialog handler.
 * @param message Text shown in the dialog body.
 * @param confirmAction Function executed on Confirm button click.
 * @param cancelAction Function executed on Cancel button click (optional).
 * @param confirmLabel Confirm button text (optional).
 * @param cancelLabel Cancel button text (optional).
 */
const VoidedAlertDialog: React.FunctionComponent<Props> = ({
  dialog,
  message,
  confirmAction,
  cancelAction = dialog.close,
  confirmLabel = 'common.yes.im.sure',
  cancelLabel = 'common.cancel',
  docRevId,
  docRevOwner,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const formState = FB.useRef(FBFormState, {});
  const applyTransition = useActionCreator(documentRevisionsActions.voidDocument);
  const releaseAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.loadAudit(docRevId));
    },
  });
  const voidRecord = () => {
    const reason = String(formState?.getValues().voidDescription);
    const voidDescription = `<p>Void</p>
    <p>${reason}</p>
    <p>${docRevOwner}, ${moment().tz(TIME_ZONE).format(MomentFormats.DateTime)}</p>`;
    releaseAsync.start(
      applyTransition,
      docRevId,
      { description: voidDescription },
      releaseAsync,
    );
  };
  return (
    <>
      {
        dialog.isOpen
        && <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="sm"
          PaperProps={{ id: 'alertDialog' }}
        >
          <DialogContent>
            <DialogContentText>
              <Grid container className={classes.contentContainer}>
                <Grid item className={classes.alertIcon}>
                  <AlertIcon />
                </Grid>
                <Grid item >
                  <Typography data-cy="dialog-header" className={classes.alertTitle}>
                    <Text translation="common.alert" />!
                  </Typography>
                  <Typography data-cy="dialog-message" className={classes.contentText}>
                    <Text translation={message} />
                  </Typography>
                </Grid>
              </Grid>
            </DialogContentText>
            <FBProvider {...{ formState }} >
              <Box style={{ padding: '0px 20px' }}>
                <FBTextField
                  name="voidDescription"
                  label="common.justification"
                  dataCy="void.record.description"
                  rules="required"
                  rows={3}
                />
              </Box>
            </FBProvider>
          </DialogContent>
          <Box className={classes.dialogAction}>
            <Button
              variant="contained"
              data-cy="void-cancel-btn"
              className={`${classes.cancelButton} ${classes.buttonLabel}`}
              onClick={cancelAction}
            >
              <Text translation={cancelLabel} />
            </Button>
            <FBSubmitButton
              variant="contained"
              data-cy="void-submit-btn"
              className={`${classes.submitButton} ${classes.buttonLabel}`}
              label={confirmLabel}
              onClick={confirmAction !== undefined ? confirmAction : voidRecord}
            />
          </Box>
        </Dialog>
      }
    </>
  );
};
export default VoidedAlertDialog;
