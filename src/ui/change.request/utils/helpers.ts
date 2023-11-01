import { ChangeRequest, ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { SelectOption } from '../../components/forms/fields/Select';
import { canEditChangeRequest } from '../helpers';

export const canChangeCROwner = (
  state: ChangeRequestStatus,
  currentEmployeeId: string,
  ownerId: string,
  isCompanyAdmin: boolean,
  hasOwnerShipTag: boolean,
): boolean =>
  ((
    state === ChangeRequestStatus.Draft
    || state === ChangeRequestStatus.InReview
    || state === ChangeRequestStatus.Implementation
    || state === ChangeRequestStatus.Approved
  )
  && currentEmployeeId === ownerId)
  || isCompanyAdmin
  || hasOwnerShipTag;

export const canEditApprovers
  = (changeRequest: ChangeRequest, currentEmployeeId: string): boolean =>
    canEditChangeRequest(changeRequest, currentEmployeeId)
    || (currentEmployeeId === changeRequest.owner.id && changeRequest.state === ChangeRequestStatus.InReview);

export const changeRequestStatusOption = (): SelectOption[] => {
  const options: SelectOption[] = [];
  Object.keys(ChangeRequestStatus).forEach((key) => {
    // TODO: Change ChangeRequestStatus status into key = value, value = text
    const keyName = ChangeRequestStatus[key as keyof typeof ChangeRequestStatus];
    options.push({ value: keyName, text: keyName });
  });
  return options;
};

export const statesWithLastSavedEnabled = [ChangeRequestStatus.Draft];
