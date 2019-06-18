import { AuthProps } from "../../../state/ducks/auth/types";
import {
  ChangeRequest,
  ChangeRequestProps,
  changeRequestsActions,
} from "../../../state/ducks/changeRequest";
import { AsyncState } from "../../../state/types";

// List
export type ListProps = ActionProps;
export interface ListStateProps {
  loadAsyncState: AsyncState;
  changeRequests: ChangeRequest[];
  currentUserEmail: string;
}

export interface ListDispatchProps {
  loadChangeRequests: typeof changeRequestsActions.loadList;
}

// Common
export type ChangeRequestUserProps = ChangeRequestProps & ActionProps & AuthProps;

export interface RouteParams {
  changeRequestId: string;
}

export interface ActionProps {
  previewChangeRequest: (changeRequestId: string) => () => void;
}
