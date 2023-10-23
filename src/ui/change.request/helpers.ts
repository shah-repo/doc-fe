import { useSelector } from 'react-redux';
import { getHasPermission } from '../../common/utils/selectors';
import { authSelectors } from '../../state/ducks/auth';
import { Permission } from '../../state/ducks/auth/types';
import { ChangeRequest, ChangeRequestStatus } from '../../state/ducks/changeRequest/types';
import { companySelectors } from '../../state/ducks/company';

export const canEditChangeRequest = (changeRequest: ChangeRequest, employeeId: string): boolean => (
  employeeId === changeRequest.owner.id && changeRequest.state === ChangeRequestStatus.Draft
);

export const useCanUpdateChangeRequest = (changeRequest: ChangeRequest, isEditing: boolean): boolean => {
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const isARInReviewEditingEnabled = useSelector(companySelectors.isAprovalRequestEditingEnabled);
  const userCanEditARInReview = useSelector(getHasPermission(Permission.AR_IN_REVIEW_EDIT));
  const canEditDraft = canEditChangeRequest(changeRequest, employeeId);

  if (!isEditing) {
    return canEditDraft;
  }

  const isOwner = employeeId === changeRequest.owner.id;
  const canEditInReview
      = changeRequest.state === ChangeRequestStatus.InReview
      && isARInReviewEditingEnabled
      && (userCanEditARInReview || isOwner);

  return canEditDraft || canEditInReview;
};
