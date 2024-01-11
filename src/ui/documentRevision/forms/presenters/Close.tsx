import Button, { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import { useDispatch } from 'react-redux';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { taskActions } from '../../../../state/ducks/tasks';
import TasksInfoDialog, {
  DialogTypes,
} from '../../../change.request/dialogs/TasksInfoDialog';
import { PendingMDInfoResponse } from '../../../change.request/FBMaterialDisposition/components/FBMaterialDispositionTable/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import styles from './close.styles';

interface Props {
  woId: string
  buttonProps?: ButtonProps
  label: string
  disabled?: boolean
  onSuccess?: () => void
}

const WOClose: React.FunctionComponent<Props> = ({
  woId,
  buttonProps,
  label,
  disabled,
  onSuccess,
}) => {
  const classes = styles();
  const tasksDialog = useDialog();
  const dispatch = useDispatch();
  const fetchPendingTasksCount = useActionCreator(
    taskActions.getPendingTasksCount,
  );
  const closeWorkOrder = useActionCreator(taskActions.closeWO);

  const tasksAsync = useAsync({
    onSuccess: (response?: PendingMDInfoResponse) => {
      if (response && response?.pendingTasksCount > 0) {
        tasksDialog.open();
      } else {
        closeWO();
      }
    },
    onError: tasksDialog.close,
  });
  const closeWOAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.load(woId));
    },
    onError: tasksDialog.close,
  });

  const onConfirm = () => {
    tasksDialog.close();
    closeWO();
  };

  const openDialog = () => {
    tasksAsync.start(fetchPendingTasksCount, woId, tasksAsync);
  };

  const closeWO = () => {
    closeWOAsync.start(closeWorkOrder, woId, closeWOAsync);
  };

  return (
    <>
      <Button
        classes={{
          root: classes.root,
          label: classes.label,
        }}
        color="primary"
        aria-label="closed"
        onClick={openDialog}
        data-cy="transition-closed"
        disabled={disabled}
        {...buttonProps}
      >
        {label}
      </Button>
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
