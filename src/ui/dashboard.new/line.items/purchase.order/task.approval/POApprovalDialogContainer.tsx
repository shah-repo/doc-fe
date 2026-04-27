import { ButtonProps } from '@material-ui/core/Button';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as SuccessIcon } from '../../../../../assets/images/success_iconn.svg';
import { translate } from '../../../../../common/intl';
import { approvalsActions } from '../../../../../state/ducks/approvals';
import { ChangeRequestTransition } from '../../../../../state/ducks/changeRequest/types';
import { dashboardMyFeedsActions } from '../../../../../state/ducks/dashboard.new/my.feeds';
import { ActionTypes } from '../../../../../state/ducks/dashboard.new/my.feeds/types';
import { dashboardTodoActions } from '../../../../../state/ducks/dashboard.new/todo';
import { documentRevisionsSelectors } from '../../../../../state/ducks/documentRevisions';
import { TASK_APPROVAL_GET_ASYNC } from '../../../../../state/ducks/documentRevisions/constants';
import { ErrorCodes } from '../../../../../state/ducks/documentRevisions/types';
import SupplierStatusDialog from '../../../../app/alert.dialog/SupplierStatusDialog';
import { toastError, toastSuccess } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import { ApprovalFailureResponse } from '../../../../documentRevision/forms/presenters/SubmitForApproval';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import { Translation } from '../../../../translations/types';
import ApproveDialog from '../../dialogs/transitionDialog/ApproveOrRejectDialog';
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

const ApproveDialogContainer: React.FunctionComponent<Props> = ({
  approvalId,
  transition,
  buttonProps,
  label,
  transitionDialog,
  type,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const supplierStatusDialog = useDialog();
  const [errorResponse, setErrorResponse] = useState<ApprovalFailureResponse>();
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
    onError: (error?: string) => {
      async.reset();
      if (!error) {
        toastError(translate('supplier.announcement.unknown.error.message'));
        return;
      }

      try {
        const parsedError = JSON.parse(error);
        const { status, response } = parsedError || {};

        if (status === ErrorCodes.PRECONDITION_FAILED && response) {
          setErrorResponse(response as ApprovalFailureResponse);
          supplierStatusDialog.open();
        } else {
          toastError(error);
        }
      } catch {
        toastError(error);
      }
    },
  });
  const asyncState = useSelector(documentRevisionsSelectors.getLoadAsyncTaskApprovalState);
  const applyTransition = useActionCreator(approvalsActions.applyTransition);

  const onSubmit = (props: PasswordFormValues) => {
    let transitionToUse = transition;
    if (type === ActionTypes.APPROVAL_REQ_BUILD_TYPE_INLINE_APPROVER && transitionToUse === 'reject') {
      transitionToUse = 'reject_with_password';
    }
    if (props.password) {
      setPassword(props.password);
      const bodyToPass = props.comment ? { comment: props.comment } : null;
      async.start(applyTransition, approvalId, transitionToUse, async, bodyToPass, props.password, TASK_APPROVAL_GET_ASYNC);
    } else {
      async.start(applyTransition, approvalId, transition, async, { comment: props.comment }, null, TASK_APPROVAL_GET_ASYNC);
    }
  };

  const onConfirmClick = () => {
    async.start(applyTransition, approvalId, transition, async, password, TASK_APPROVAL_GET_ASYNC, true);
    setPassword('');
    supplierStatusDialog.close();
  };

  return (
    <>
      <ApproveDialog
        onSubmit={onSubmit}
        asyncState={asyncState}
        buttonProps={buttonProps}
        transition={transition}
        label={label}
        type={type}
        {...{
          transitionDialog,
        }}
      />
      {errorResponse && (
        <SupplierStatusDialog
          dialog={supplierStatusDialog}
          data={errorResponse}
          confirmAction={onConfirmClick} />
      )}
    </>
  );
};

export default ApproveDialogContainer;
