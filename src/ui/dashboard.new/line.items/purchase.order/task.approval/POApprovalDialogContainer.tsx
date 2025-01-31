import { ButtonProps } from '@material-ui/core/Button';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as SuccessIcon } from '../../../../../assets/images/success_iconn.svg';
import { approvalsActions } from '../../../../../state/ducks/approvals';
import { ChangeRequestTransition } from '../../../../../state/ducks/changeRequest/types';
import { dashboardMyFeedsActions } from '../../../../../state/ducks/dashboard.new/my.feeds';
import { dashboardTodoActions } from '../../../../../state/ducks/dashboard.new/todo';
import { documentRevisionsSelectors } from '../../../../../state/ducks/documentRevisions';
import { TASK_APPROVAL_GET_ASYNC } from '../../../../../state/ducks/documentRevisions/constants';
import SupplierStatusDialog from '../../../../app/alert.dialog/SupplierStatusDialog';
import { toastError, toastSuccess } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import { IApprovalErrorResponse } from '../../../../documentRevision/forms/presenters/SubmitForApproval';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import { Translation } from '../../../../translations/types';
import ApproveDialog from '../../dialogs/transitionDialog/ApproveOrRejectDialog';
import PoRejectDialog from '../../dialogs/transitionDialog/PoRejectDialog';
import { PasswordFormValues } from '../../dialogs/transitionDialog/types';
interface Props {
  approvalId: string
  transition: ChangeRequestTransition
  buttonProps?: ButtonProps
  label: string
  title?: string
  transitionDialog: any
  onSuccess?: () => void
  type?: string
  translationRejectMsg?: Translation
}

interface ResponseProps {
  status: string
}

const ApproveDialogueContainer: React.FunctionComponent<Props> = ({
  approvalId,
  transition,
  buttonProps,
  label,
  type,
  transitionDialog,
  translationRejectMsg = 'dashboard.po.reject.alert',
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const supplierStatusDialog = useDialog();
  const [errorResponse, setErrorResponse] = useState<IApprovalErrorResponse>();
  const [password, setPassword] = useState<string>();
  const async = useAsync({
    onSuccess: (response?: ResponseProps) => {
      transitionDialog.close();
      toastSuccess(
        <>
          <div style={{ display: 'flex' }}>
            <div>
              <SuccessIcon style={{ height: '30px' }} />
            </div>
            <div style={{ color: Colors.black }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>
                  <Text translation={`approvalRequest.status.${response?.status}` as Translation} />
                </span>
              </div>
            </div>
          </div>
        </>, {
          closeButton: true,
        });

      if (onSuccess) {
        onSuccess();
      } else {
        dispatch(dashboardTodoActions.loadMyFeedsList());
        dispatch(dashboardMyFeedsActions.loadMyFeedsList());
      }
    },
    onError: (error) => {
      async.reset();
      try {
        const parsedError = JSON.parse(error as string);
        if (parsedError.status === 412 && parsedError.response) {
          setErrorResponse(parsedError.response as IApprovalErrorResponse);
          supplierStatusDialog.open();
        } else {
          toastError(error as string);
        }
      } catch (err) {
        toastError(error as string);
      }
    },
  });
  const asyncState = useSelector(documentRevisionsSelectors.getLoadAsyncTaskApprovalState);
  const applyTransition = useActionCreator(approvalsActions.applyTransition);
  const onSubmit = (props: PasswordFormValues) => {
    setPassword(props.password);
    async.start(applyTransition, approvalId, transition, async, props.password, TASK_APPROVAL_GET_ASYNC);
  };
  const onReject = () => {
    async.start(applyTransition, approvalId, transition, async, null);
  };

  const onConfirmClick = () => {
    async.start(applyTransition, approvalId, transition, async, password, TASK_APPROVAL_GET_ASYNC, true);
    setPassword('');
    supplierStatusDialog.close();
  };

  return (
    <>
      { type && <PoRejectDialog
        dialog={transitionDialog}
        message={translationRejectMsg}
        onSubmit={onReject}
        cancelAction={transitionDialog.close}
      />}
      { !type && <ApproveDialog
        onSubmit={onSubmit}
        asyncState={asyncState}
        buttonProps={buttonProps}
        transition={transition}
        label={label}
        {...{
          transitionDialog,
        }}
      />}
      {errorResponse && (
        <SupplierStatusDialog
          dialog={supplierStatusDialog}
          data={errorResponse}
          confirmAction={onConfirmClick} />
      )}
    </>
  );
};

export default ApproveDialogueContainer;
