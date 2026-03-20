import { Box, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import { styles as useStyles } from '../../app/alert.dialog/AlertDialog.styles';
import Text from '../../components/Text';
import { AlertDialog } from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { ApprovalFailureResponse, ApprovalItem } from '../../documentRevision/forms/presenters/SubmitForApproval';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';

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
  const items = isError ? errorItems : warningItems;

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

  return (
    <AlertDialog
      handler={dialog}
      actions={
        isError ? (
          <Button onClick={cancelAction} data-cy="dialog-continue">
            {translate(infoLabel)}
          </Button>
        ) : (
          <>
            <Button kind="outlined" onClick={cancelAction} data-cy="dialog-cancel">
              {translate(cancelLabel)}
            </Button>
            <Button onClick={confirmAction} data-cy="dialog-continue">
              {translate(confirmLabel)}
            </Button>
          </>
        )
      }
      title={title}
      warning={!isError}
    >
      <Box>
        <Typography data-cy="dialog-message" className={classes.contentText}>
          <Text message={translate('purchaseOrder.part.dialog.general.prefix')} />
          <b> {getConflictingPhases(items)} </b>
          <Text message={translate('purchaseOrder.part.dialog.general.suffix')} />
        </Typography>
        <Typography data-cy="dialog-message" className={`${classes.contentText} ${classes.textBold}`}>
          [{!isError && isWarning ? getConflictingParts(warningItems) : getConflictingParts(errorItems)}]
        </Typography>
        {!isError && isWarning && (
          <Box className={cx(classes.topSpacing, classes.contentText)}>
            <Text translation="supplier.status.warning.continue.message" />
          </Box>
        )}
      </Box>
    </AlertDialog>
  );
};

export default POLineItemAlert;
