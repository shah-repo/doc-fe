import { ChangeRequest, ChangeRequestStatus } from '../../state/ducks/changeRequest/types';

export const canEditChangeRequest = (changeRequest: ChangeRequest, employeeId: string): boolean => (
  employeeId === changeRequest.owner.id && changeRequest.state === ChangeRequestStatus.Draft
);
