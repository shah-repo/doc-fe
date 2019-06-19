import { RouteComponentProps } from "react-router-dom";
import { AuthProps } from "../../../state/ducks/auth/types";
import {
  ChangeRequestProps,
  changeRequestsActions,
  ChangeRequestsProps,
} from "../../../state/ducks/changeRequest";
import { AsyncState } from "../../../state/types";

// Container
export type ContainerStateProps = LoadAsyncState & ChangeRequestProps;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;

export interface ContainerDispatchProps {
  load: typeof changeRequestsActions.load;
}

// List
export type ListProps = ActionProps;
export type ListStateProps = ChangeRequestsProps & LoadAsyncState & AuthProps;

export interface ListDispatchProps {
  loadChangeRequests: typeof changeRequestsActions.loadList;
}

// Common
export type ChangeRequestsUserProps = ChangeRequestsProps & ActionProps & AuthProps;
export type ChangeRequestUserProps = ChangeRequestProps & AuthProps;

export interface RouteParams {
  changeRequestId: string;
}

export interface ActionProps {
  editChangeRequest: (changeRequestId: string) => void;
}

interface LoadAsyncState {
  loadAsyncState: AsyncState;
}
