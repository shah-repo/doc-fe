import { ChangeRequestStatus } from '../../state/ducks/changeRequest';

export interface ChangeRequestRouteParams {
  changeRequestId: string;
}

export interface ChangeRequestActionProps {
  editChangeRequest: (changeRequestId: string) => () => void;
  previewChangeRequest: (changeRequestId: string) => () => void;
}

export interface ChangeRequestListItem {
  id: string;
  description: string;
  owner: string;
  state: ChangeRequestStatus;
}