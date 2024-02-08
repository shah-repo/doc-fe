import { ButtonProps } from '@material-ui/core/Button';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import { ChangeRequestTransition, ChangeRequestTransitionResponse } from '../../../state/ducks/changeRequest/types';
import { companySelectors } from '../../../state/ducks/company';
import { taskActions } from '../../../state/ducks/tasks';
import TransitionDialog from '../../components/transitionDialog/TransitionDialog';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import { PendingMDInfoResponse } from '../FBMaterialDisposition/components/FBMaterialDispositionTable/types';
import { EffectiveDateFormValues, PasswordFormValues } from '../form/types';
import TasksInfoDialog, { DialogTypes } from './TasksInfoDialog';

interface Props {
  changeRequestId: string
  transition: ChangeRequestTransition
  buttonProps?: ButtonProps
  label: string
  onSuccess?: () => void
}

const TransitionDialogContainer: React.FunctionComponent<Props> = ({
  changeRequestId,
  transition,
  buttonProps,
  label,
  onSuccess,
}) => {
  const transitionDialog = useDialog();
  const tasksDialog = useDialog();
  const lotStatusDialog = useDialog();
  const effectiveDateDialog = useDialog();
  const [pendingMDInfo, setPendingMDInfo] = useState({ isLotStatusWillBeUpdated: false });
  const applyTransitionAction = useActionCreator(changeRequestsActions.applyTransition);
  const fetchPendingTasksCount = useActionCreator(taskActions.getPendingTasksCount);
  const settings = useSelector(companySelectors.getGeneralSettings);

  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      onSuccess && onSuccess();
      if (transition === 'closed') {
        effectiveDateDialog.close();
      } else {
        transitionDialog.close();
      }
    },
    onError: () => {
      transitionDialog.close();
    },
  });

  const tasksAsync = useAsync({
    onSuccess: (response?: PendingMDInfoResponse) => {
      response && setPendingMDInfo(response);
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
    if (settings?.shouldAutoUpdateLotStatus && pendingMDInfo.isLotStatusWillBeUpdated) {
      lotStatusDialog.open();
    } else {
      effectiveDateDialog.open();
    }
  };

  const openDialog = () => {
    async.reset();
    if (transition === 'closed') {
      tasksAsync.start(fetchPendingTasksCount, changeRequestId, tasksAsync);
    } else {
      transitionDialog.open();
    }
  };

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      applyTransitionAction,
      changeRequestId, values, transition, async,
    );
  };

  return (<>
    <TransitionDialog
      openDialog={openDialog}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      buttonProps={buttonProps}
      transition={transition}
      label={label}
      { ...{
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
    <TasksInfoDialog
      dialog={lotStatusDialog}
      message="approvalRequest.lot.status.alert.message"
      type={DialogTypes.Info}
      title="approvalRequest.lot.status.alert.title"
      confirmLabel="common.ok.proceed"
      cancelLabel="common.cancel"
      confirmAction={() => {
        lotStatusDialog.close();
        effectiveDateDialog.open();
      }}
    />
  </>
  );
};

export default TransitionDialogContainer;
