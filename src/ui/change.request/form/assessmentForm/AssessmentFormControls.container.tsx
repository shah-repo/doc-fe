import { ButtonProps } from '@material-ui/core/Button';
import { FormikErrors } from 'formik';
import { find, isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import { GroupTag } from '../../../../state/ducks/auth/types';
import { ChangeRequest, ChangeRequestStatus, ChangeRequestTransition } from '../../../../state/ducks/changeRequest/types';
import { ApprovalStatus } from '../../../../state/ducks/common/types';
import HeaderMenu from '../../../components/common/header/Menu';
import OwnerChangerContainer from '../../../components/common/owner.changer/container';
import { RequestType } from '../../../components/common/owner.changer/helpers/types';
import { useFormContext } from '../../../components/forms/FormContext';
import useGetHasTag from '../../../hooks/useGetHasTag';
import ChangeRequestTransitionDialogContainer from '../../dialogs/ChangeRequestTransitionDialog.container';
import ChangeRequestWithdrawDialog from '../../dialogs/ChangeRequestWithdrawDialog';
import ExportARToEmail from '../../export.email/ExportAREmail';
import { canChangeCROwner } from '../../utils/helpers';
import { EditButtons } from './EditButtons';
import TransitionButton from './TransitionButton';
import AssessmentFormVoidContainer from './Void';

interface Props {
  changeRequest?: ChangeRequest
  errors?: FormikErrors<any>
  isButtonShown?: boolean
}

const AssessmentFormControlsContainer: React.FunctionComponent<Props> = ({
  changeRequest,
  errors,
  isButtonShown = false,
}) => {
  const currentUserEmail = useSelector(authSelectors.currentUserEmail);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const isCompanyAdmin = useGetHasTag(GroupTag.USER_MANAGEMENT);
  const hasOwnershipTag = useGetHasTag(GroupTag.OWNERSHIP_CHANGE);
  const formContext = useFormContext();

  const canChangeOwnerShip = React.useMemo(() => {
    if (!changeRequest) {
      return false;
    }
    return canChangeCROwner(
      changeRequest.state,
      currentEmployeeId,
      changeRequest?.owner.id,
      isCompanyAdmin,
      hasOwnershipTag);
  }, [changeRequest, currentEmployeeId, isCompanyAdmin, hasOwnershipTag]);

  if (!changeRequest) {
    return null;
  }

  const renderAlertDialogButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => showButton
        && <ChangeRequestWithdrawDialog
          transition={transition}
          changeRequestId={changeRequest.id}
          buttonProps={buttonProps}
          renderAsButton={true}
          label={`changeRequest.transition.${transition}`}
        />;

  const renderDialogButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => showButton
        && <ChangeRequestTransitionDialogContainer
          transition={transition}
          changeRequestId={changeRequest.id}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
        />;

  const renderTransitionButton = (
    showButton: boolean,
    transition: ChangeRequestTransition,
    buttonProps?: ButtonProps,
  ) => showButton && !isButtonShown
        && <TransitionButton
          changeRequestId={changeRequest.id}
          transition={transition}
          buttonProps={buttonProps}
          label={`changeRequest.transition.${transition}`}
        />;

  const formHasErrors = !isEmpty(errors);
  const isCurrentUserOwner = changeRequest.owner.user.email === currentUserEmail;
  const canWithdraw
    = !formContext.isEditing && isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.InReview;
  const canSendToReview
    = isCurrentUserOwner && changeRequest.state === ChangeRequestStatus.Draft;
  const canClose
    = isCurrentUserOwner
    && (changeRequest.state === ChangeRequestStatus.Approved
      || changeRequest.state === ChangeRequestStatus.Implementation);

  const currentUserApproval = changeRequest.approvals.filter(
    (approval) => approval.approver.user.email === currentUserEmail,
  );

  const approverHasPendingStatus = find(currentUserApproval, (approval) => approval.status === ApprovalStatus.Pending);
  const isCurrentUserApprover = !!currentUserApproval;
  const canApproveOrReject
    = !formContext.isEditing && isCurrentUserApprover
    && changeRequest.state === ChangeRequestStatus.InReview
    && Boolean(approverHasPendingStatus);

  return (
    <>
      <EditButtons changeRequest={changeRequest} />
      {renderTransitionButton(canSendToReview, 'in_review')}
      {renderDialogButton(canApproveOrReject, 'reject', { disabled: formHasErrors })}
      {renderDialogButton(canApproveOrReject, 'approve', { disabled: formHasErrors })}
      {renderDialogButton(canClose, 'closed')}
      {renderAlertDialogButton(canWithdraw, 'withdrawn')}
      <HeaderMenu>
        {canSendToReview && <AssessmentFormVoidContainer changeRequest={changeRequest} />}
        {
          canChangeOwnerShip
           && <OwnerChangerContainer requestId={changeRequest.id} requestType={RequestType.ChangeRequest}
             renderAsButton={false} />
        }
        <ExportARToEmail {...{ id: changeRequest.id, renderAsButton: false }} />
      </HeaderMenu>
    </>
  );
};

export default AssessmentFormControlsContainer;
