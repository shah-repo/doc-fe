import { FormikProps } from "formik";
import { RouteComponentProps } from "react-router-dom";
import { attachmentsActions } from "../../../state/ducks/attachments";
import { AuthProps } from "../../../state/ducks/auth/types";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { AssessmentType, ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DataProps } from "../../../state/ducks/common";
import { LoadAsyncState } from "../../../state/types";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";

// Container
export type ContainerStateProps = LoadAsyncState & DataProps<ChangeRequest>;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;

export interface ContainerDispatchProps {
  load: typeof changeRequestsActions.load;
}

// List
export type ListProps = ActionProps;
export type ListStateProps = DataProps<ChangeRequest[]> & LoadAsyncState & AuthProps;

export interface ListDispatchProps {
  loadChangeRequests: typeof changeRequestsActions.loadList;
}

// Assessment
export enum AssessmentReasoningOption {
  statement_1 = "Statement 1",
  statement_2 = "Statement 2",
  statement_3 = "Statement 3",
}

export interface AssessmentProps {
  form: FormikProps<ChangeRequestFormValues>;
}

export interface AssessmentItemProps extends AssessmentProps {
  type: AssessmentType;
}

export interface AssessmentDispatchProps {
  upload: typeof attachmentsActions.upload;
}

// Summary

// Common
export type ChangeRequestsUserProps = DataProps<ChangeRequest[]> & ActionProps & AuthProps;
export type ChangeRequestUserProps = DataProps<ChangeRequest> & AuthProps;

export interface RouteParams {
  changeRequestId: string;
}

export interface ActionProps {
  editChangeRequest: (changeRequestId: string) => void;
  previewChangeRequest: (changeRequestId: string) => void;
}
