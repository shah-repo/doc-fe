import { Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import {
  ChangeRequest, ChangeRequestEditRequestBody,
} from '../../../state/ducks/changeRequest/types';
import { AlertDialog } from '../../components/dialogs';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';

interface Props {
  changeRequest?: ChangeRequest
  dialog: DialogHandler
  warning: boolean
}

const PartLCPDialog: React.FunctionComponent<Props> = ({
  changeRequest,
  dialog,
  warning,
}) => {
  const async = useAsync<ChangeRequest>({
    onSuccess: dialog.close,
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
      hideCancelButton= {!warning}
      title={warning ? 'common.warning' : 'common.alert'}
      confirmLabel={warning ? 'common.yes.continue' : 'common.ok'}
      cancelLabel={warning ? 'common.no.go.back' : undefined}
      warning={warning}
    >
      <Typography data-cy="dialog-message">
        {warning ? (
          <span>{translate('bom.ar.part.lcp.notify.warning.message')}</span>
        ) : (
          <span>{translate('bom.ar.part.lcp.notify.alert.message')}</span>
        )}
      </Typography>
    </AlertDialog>
  );
};

export default PartLCPDialog;
