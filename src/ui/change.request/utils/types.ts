import { RouteComponentProps } from 'react-router-dom';
import { AuthProps } from '../../../state/ducks/auth/types';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import { DataProps } from '../../../state/ducks/common/types';
import { LoadAsyncState } from '../../../state/types';

// Container
export type ContainerStateProps = LoadAsyncState & DataProps<ChangeRequest> & AuthProps;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;

export interface ContainerDispatchProps {
  load: typeof changeRequestsActions.load;
}

// Common
export type ChangeRequestUserProps = DataProps<ChangeRequest> & AuthProps;

export interface RouteParams {
  changeRequestId: string;
}

export interface RouteParamsCreate {
  documentTypeId: string;
  formId: string;
}
