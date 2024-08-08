import { Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestDependentOnDocRevsState, ChangeRequestEditRequestBody } from '../../../state/ducks/changeRequest/types';
import { AlertDialog } from '../../components/dialogs';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';

interface Props {
  changeRequest?: ChangeRequest
  details: ChangeRequestDependentOnDocRevsState
  dialog: DialogHandler
  closeAction?: () => void
  confirmLabel?: Translation
  cancelLabel?: Translation
  warning: boolean
}

const PartLCPDialog: React.FunctionComponent<Props> = ({
  changeRequest,
  details,
  dialog,
  closeAction,
  confirmLabel = 'common.continue',
  cancelLabel = 'common.cancel',
  warning,
}) => {
  const async = useAsync<ChangeRequest>({
    onSuccess: () => {
      dialog.close();
    },
  });

  const saveChangeRequest = useActionCreator(changeRequestsActions.save);

  const onCancelAlertDialog = () => {
    dialog.close();
  };

  const onConfirmAlertDialog = () => {
    const crFormInput = changeRequest?.formInput;
    async.reset();
    async.start(
      saveChangeRequest,
          changeRequest?.id,
          { formInput: crFormInput } as ChangeRequestEditRequestBody,
          async,
    );
  };

  return (
    <AlertDialog
      handler={dialog}
      onConfirm={onConfirmAlertDialog}
      onCancel={onCancelAlertDialog}
      title="common.warning"
      confirmLabel="common.yes.continue"
      cancelLabel="common.no.go.back"
      warning={warning}
    >
      <Typography data-cy="dialog-message">
        {warning ? <span>{translate('bom.ar.part.lcp.notify.warning.message')}</span>
          : <span>{translate('bom.ar.part.lcp.notify.alert.message')}</span>
        }
      </Typography>
    </AlertDialog>
  );
};

export default PartLCPDialog;
