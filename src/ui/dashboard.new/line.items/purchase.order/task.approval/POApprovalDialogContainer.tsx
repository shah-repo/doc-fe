import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as SuccessIcon } from '../../../../../assets/images/success_iconn.svg';
import { approvalsActions } from '../../../../../state/ducks/approvals';
import { ChangeRequestTransition } from '../../../../../state/ducks/changeRequest/types';
import { dashboardMyFeedsActions } from '../../../../../state/ducks/dashboard.new/my.feeds';
import { dashboardTodoActions } from '../../../../../state/ducks/dashboard.new/todo';
import Text from '../../../../components/Text';
import { toastSuccess } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import Colors from '../../../../layout/theme-next/colors';
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
}

const ApproveDialogueContainer: React.FunctionComponent<Props> = ({
  approvalId,
  transition,
  buttonProps,
  label,
  type,
  transitionDialog,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const async = useAsync({
    onSuccess: (response) => {
      transitionDialog.close();
      toastSuccess(<><div style={{ display: 'flex' }}>
        <div><SuccessIcon style={{ height: '30px' }} /></div>
        <div style={{ color: Colors.black }}>
          <div><span style={{ fontWeight: 'bold' }}>
            <Text translation={`approvalRequest.status.${response?.status}` as Translation} /></span></div>
        </div>
      </div></>, {
        closeButton: true,
      });
      dispatch(dashboardTodoActions.loadMyFeedsList());
      dispatch(dashboardMyFeedsActions.loadMyFeedsList());
    },
  });
  const applyTransition = useActionCreator(approvalsActions.applyTransition);
  const onSubmit = (props: PasswordFormValues) => {
    async.start(applyTransition, approvalId, transition, async, props.password);
  };
  const onReject = () => {
    async.start(applyTransition, approvalId, transition, async, null);
  };
  return (
    <>
      { type && <PoRejectDialog
        dialog={transitionDialog}
        message="dashboard.po.reject.alert"
        onSubmit={onReject}
        cancelAction={transitionDialog.close}
      />}
      { !type && <ApproveDialog
        onSubmit={onSubmit}
        asyncState={async.asyncState}
        buttonProps={buttonProps}
        transition={transition}
        label={label}
        {...{
          transitionDialog,
        }}
      />}
    </>
  );
};

export default ApproveDialogueContainer;
