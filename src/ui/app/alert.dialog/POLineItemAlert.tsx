import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import Text from '../../components/Text';
import { Dialog } from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { ApprovalFailureResponse, ApprovalItem } from '../../documentRevision/forms/presenters/SubmitForApproval';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import { styles as useStyles } from './AlertDialog.styles';

interface Props {
  confirmAction?: (values?) => void
  cancelAction?: (event: React.MouseEvent<HTMLElement>) => void
  data?: ApprovalFailureResponse
  dialog: DialogHandler
  confirmLabel?: Translation
  cancelLabel?: Translation
  infoLabel?: Translation
}

const POLineItemAlert: React.FC<Props> = ({
  dialog,
  confirmAction,
  data,
  cancelAction = dialog.close,
  confirmLabel = 'common.yes.continue',
  cancelLabel = 'common.no.go.back',
  infoLabel = 'common.ok',
}) => {
  const classes = useStyles();

  const isOpen = dialog.isOpen;
  if (!isOpen) return null;

  const { isWarning, errorItems = [], warningItems = [] } = data ?? {};
  const isError = errorItems.length > 0;
  const title: Translation = isError ? 'common.alert' : 'common.warning';

  const dialogIcon = isError ? solid('triangle-exclamation') : regular('circle-exclamation');
  const dialogIconClass = isError ? classes.iconError : classes.iconWarning;
  const items = isError ? errorItems : warningItems;

  const getConflictingPhases = (items: ApprovalItem[]) => {
    const itemPhasesSet = new Set(items.map((item) => item.phase));
    const phases: string[] = Array.from(itemPhasesSet).map((phase) =>
      translate('supplier.conflict.phase.text', { phase }),
    );

    if (phases.length === 1) return phases[0];
    return `${phases.slice(0, -1).join(', ')} and ${phases[items.length - 1]}`;
  };

  const renderIcon = () => (
    <Grid item className={isError ? classes.alertIcon : classes.warningIcon}>
      <FontAwesomeIcon icon={dialogIcon} className={dialogIconClass} />
    </Grid>
  );

  const renderMessage = () => (
    <Typography data-cy="dialog-message" className={classes.contentText}>
      <Text message={translate('purchaseOrder.supplierStatus.dialog.general.prefix')} />
      <b> {getConflictingPhases(items)} </b>
      <Text message={translate('purchaseOrder.part.dialog.general.suffix')} />
    </Typography>
  );

  const renderButtons = () => {
    if (isError) {
      return (
        <Button
          size="small"
          variant="contained"
          onClick={cancelAction}
          className={cx(classes.submitButton, classes.buttonLabel)}
          data-cy="dialog-continue"
        >
          {translate(infoLabel)}
        </Button>
      );
    }

    return (
      <>
        <Button
          size="small"
          variant="text"
          kind="outlined"
          onClick={cancelAction}
          className={cx(classes.cancelButton, classes.buttonLabel)}
          data-cy="dialog-cancel"
        >
          {translate(cancelLabel)}
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={confirmAction}
          className={cx(classes.submitButton, classes.buttonLabel)}
          data-cy="dialog-continue"
        >
          {translate(confirmLabel)}
        </Button>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onClose={dialog.close} maxWidth="sm" PaperProps={{ id: 'poLineItemAlert' }}>
      <Grid container className={classes.contentContainer}>
        {renderIcon()}
        <Grid item>
          <Typography data-cy="dialog-header" className={classes.alertTitle}>
            <Text translation={title} />
          </Typography>
          {renderMessage()}
          {!isError && isWarning && (
            <Box className={cx(classes.topSpacing, classes.contentText)}>
              <Text translation="supplier.status.warning.continue.message" />
            </Box>
          )}
        </Grid>
      </Grid>
      <Box className={classes.dialogAction}>{renderButtons()}</Box>
    </Dialog>
  );
};

export default POLineItemAlert;
