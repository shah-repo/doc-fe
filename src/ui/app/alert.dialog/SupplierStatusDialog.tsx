import { Box, Button, DialogContent, DialogContentText, Grid, Typography } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/Warning';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import Text from '../../components/Text';
import { Dialog } from '../../components/dialogs';
import { ApprovalFailureResponse, ApprovalItem } from '../../documentRevision/forms/presenters/SubmitForApproval';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import { styles as useStyles } from './AlertDialog.styles';

interface Props {
  confirmAction: (values?) => void
  cancelAction?: (e: React.MouseEvent<HTMLElement>) => void
  data: ApprovalFailureResponse
  dialog: DialogHandler
  confirmLabel?: Translation
  cancelLabel?: Translation
  infoLabel?: Translation
}

const SupplierStatusDialog: React.FunctionComponent<Props> = ({
  dialog,
  confirmAction,
  data,
  cancelAction = dialog.close,
  confirmLabel = 'common.yes.continue',
  cancelLabel = 'common.no.go.back',
  infoLabel = 'common.ok',
}) => {
  const classes = useStyles();

  if (!dialog.isOpen) {
    return null;
  }

  const getConflictingPhases = (items: ApprovalItem[]) => {
    const itemPhasesSet = new Set(items.map((item) => item.phase));
    const phases: string[] = Array.from(itemPhasesSet).map((phase) =>
      translate('supplier.conflict.phase.text', { phase }),
    );

    if (phases.length === 1) return phases[0];
    return `${phases.slice(0, -1).join(', ')} and ${phases[items.length - 1]}`;
  };

  const getConflictingParts = (items: ApprovalItem[]) => {
    return items.map((item) => `${item.docId} - ${item.displayRevision}`).join(', ');
  };

  const { isWarning, isSupplierUndefined, errorItems, warningItems, isPartNotReleased } = data ?? {};

  const isError = errorItems?.length > 0;
  const title: Translation = isError ? 'common.alert' : 'common.warning';

  return (
    <Dialog open={dialog.isOpen} onClose={dialog.close} maxWidth="sm" PaperProps={{ id: 'supplierStatusDialog' }}>
      <DialogContent>
        <DialogContentText>
          <Grid container className={classes.contentContainer}>
            { isError && (
              <Grid item className={classes.alertIcon}>
                <WarningIcon />
              </Grid>
            )}
            { !isError && isWarning && (
              <Grid item className={classes.warningIcon}>
                <ErrorOutlineIcon />
              </Grid>
            )}
            <Grid item>
              <Typography data-cy="dialog-header" className={classes.alertTitle}>
                <Text translation={title} />
              </Typography>
              { isError && (
                <>
                  { isSupplierUndefined ? (
                    <Typography data-cy="dialog-message" className={classes.contentText}>
                      <Text message={translate('purchaseOrder.supplierStatus.dialog.status.error')} />
                    </Typography>
                  ) : isPartNotReleased ? (
                    <>
                      <Typography data-cy="dialog-message" className={classes.contentText}>
                        <Text message={translate('purchaseOrder.part.dialog.general.prefix')} />
                        <b> {getConflictingPhases(errorItems)} </b>
                        <Text message={translate('purchaseOrder.part.dialog.general.suffix')} />
                      </Typography>
                      <Typography
                        data-cy="dialog-message"
                        className={cx(
                          classes.contentText,
                          classes.textBold,
                        )}>
                          [{getConflictingParts(errorItems)}]
                      </Typography>
                    </>
                  ) : (
                    <Typography data-cy="dialog-message" className={classes.contentText}>
                      <Text message={translate('purchaseOrder.supplierStatus.dialog.general.prefix')} />
                      <b> {getConflictingPhases(errorItems)} </b>
                      <Text message={translate('purchaseOrder.supplierStatus.dialog.general.suffix')} />
                    </Typography>
                  )}
                </>
              )}
              { !isError && isWarning && (
                <>
                  { isSupplierUndefined
                  && <Typography data-cy="dialog-message" className={classes.contentText}>
                    <Text message={
                      translate('purchaseOrder.supplierStatus.dialog.status.warning')
                    }
                    />
                  </Typography> }
                  { isPartNotReleased
                    ? <>
                      <Typography data-cy="dialog-message" className={classes.contentText}>
                        <Text message={translate('purchaseOrder.part.dialog.general.prefix')} />
                        <b> {getConflictingPhases(warningItems)} </b>
                        <Text message={translate('purchaseOrder.part.dialog.general.suffix')} />
                      </Typography>
                      <Typography
                        data-cy="dialog-message"
                        className={cx(
                          classes.contentText,
                          classes.textBold,
                        )}>
                          [{getConflictingParts(warningItems)}]
                      </Typography>
                    </>
                    : <Typography data-cy="dialog-message" className={classes.contentText}>
                      <Text message={translate('purchaseOrder.supplierStatus.dialog.general.prefix')} />
                      <b> {getConflictingPhases(warningItems)} </b>
                      <Text message={translate('purchaseOrder.supplierStatus.dialog.general.suffix')} />
                    </Typography>
                  }
                </>
              )}
              { !isError && isWarning
                  && <Box className={cx(classes.topSpacing, classes.contentText)}>
                    <Text translation="supplier.status.warning.continue.message" />
                  </Box>
              }
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <Box className={classes.dialogAction}>
        {isWarning && !isError && (
          <Button
            variant="text"
            className={cx(classes.cancelButton, classes.buttonLabel)}
            onClick={cancelAction}
            id="dialog-cancel"
            data-cy="dialog-cancel"
          >
            <Text translation={cancelLabel} />
          </Button>
        )}
        {isWarning && !isError && (
          <Button
            variant="contained"
            className={cx(classes.submitButton, classes.buttonLabel)}
            id="dialog-continue"
            data-cy="dialog-continue"
            onClick={confirmAction}
          >
            <Text translation={confirmLabel} />
          </Button>
        )}
        {isError && (
          <Button
            variant="contained"
            className={cx(classes.submitButton, classes.buttonLabel)}
            id="dialog-continue"
            data-cy="dialog-continue"
            onClick={cancelAction}
          >
            <Text translation={infoLabel} />
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default SupplierStatusDialog;
