import { FormikProps } from "formik";
import { RouteComponentProps } from "react-router-dom";
import { attachmentsActions } from "../../../state/ducks/attachments";
import { AuthProps } from "../../../state/ducks/auth/types";
import {
  ChangeRequestProps,
  changeRequestsActions,
  ChangeRequestsProps,
} from "../../../state/ducks/changeRequest";
import { AssessmentType, ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { LoadAsyncState } from "../../../state/types";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";

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

// Assessment
export interface AssessmentProps {
  form: FormikProps<ChangeRequestFormValues>;
}

export interface AssessmentItemProps extends AssessmentProps {
  type: AssessmentType;
}

export interface AssessmentDispatchProps {
  upload: typeof attachmentsActions.upload;
}

// Common
export type ChangeRequestsUserProps = ChangeRequestsProps & ActionProps & AuthProps;
export type ChangeRequestUserProps = ChangeRequestProps & AuthProps;

export interface RouteParams {
  changeRequestId: string;
}

export interface ActionProps {
  editChangeRequest: (changeRequestId: string) => void;
  previewChangeRequest: (changeRequestId: string) => void;
}
