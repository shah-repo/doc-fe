import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import { changeRequestsActions } from '../../../../state/ducks/changeRequest';
import { ChangeRequestTransitionResponse } from '../../../../state/ducks/changeRequest/types';
import { taskActions } from '../../../../state/ducks/tasks';
import TasksInfoDialog, {
  DialogTypes,
} from '../../../change.request/dialogs/TasksInfoDialog';
import { PendingMDInfoResponse } from '../../../change.request/FBMaterialDisposition/components/FBMaterialDispositionTable/types';
import {
  EffectiveDateFormValues,
  PasswordFormValues,
} from '../../../change.request/form/types';
import TransitionDialog from '../../../components/transitionDialog/TransitionDialog';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';

interface Props {
  woId: string
  buttonProps?: ButtonProps
  label: string
  onSuccess?: () => void
}

const WOClose: React.FunctionComponent<Props> = ({
  woId,
  buttonProps,
  label,
  onSuccess,
}) => {
  const transitionDialog = useDialog();
  const tasksDialog = useDialog();
  const effectiveDateDialog = useDialog();
  const applyTransitionAction = useActionCreator(
    changeRequestsActions.applyTransition,
  );
  const fetchPendingTasksCount = useActionCreator(
    taskActions.getPendingTasksCount,
  );

  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      onSuccess?.();
      effectiveDateDialog.close();
    },
    onError: transitionDialog.close,
  });

  const tasksAsync = useAsync({
    onSuccess: (response?: PendingMDInfoResponse) => {
      if (response && response?.pendingTasksCount > 0) {
        tasksDialog.open();
      } else {
        effectiveDateDialog.open();
      }
    },
    onError: transitionDialog.close,
  });

  const onConfirm = () => {
    tasksDialog.close();
    effectiveDateDialog.open();
  };

  const openDialog = () => {
    async.reset();
    tasksAsync.start(fetchPendingTasksCount, woId, tasksAsync);
  };

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(applyTransitionAction, woId, values, 'closed', async);
  };

  return (
    <>
      <TransitionDialog
        openDialog={openDialog}
        onSubmit={onSubmit}
        asyncState={async.asyncState}
        buttonProps={buttonProps}
        transition="closed"
        label={label}
        {...{
          transitionDialog,
          effectiveDateDialog,
        }}
      />
      <TasksInfoDialog
        dialog={tasksDialog}
        message="approvalRequest.tasks.incomplete.message"
        type={DialogTypes.Warning}
        title="common.warning"
        confirmLabel="common.yes.continue"
        cancelLabel="common.no.go.back"
        confirmAction={onConfirm}
      />
    </>
  );
};

export default WOClose;
