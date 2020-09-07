/* eslint-disable @typescript-eslint/camelcase */
import { FormikProps } from "formik";
import { RouteComponentProps } from "react-router-dom";
import { attachmentsActions } from "../../../state/ducks/attachments";
import { AuthProps } from "../../../state/ducks/auth/types";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { AssessmentType, ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DataProps } from "../../../state/ducks/common";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { LoadAsyncState } from "../../../state/types";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import { ChangeRequestFormValues } from "../form/types";

// Container
export type ContainerStateProps = LoadAsyncState & DataProps<ChangeRequest> & AuthProps;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;

export interface ContainerDispatchProps {
  load: typeof changeRequestsActions.load;
}

// List
export type ListProps = ActionProps;

export interface ListDispatchProps {
  loadChangeRequests: typeof changeRequestsActions.loadList;
}

// Assessment
export enum DesignAssessmentReasoningOption {
  not_affect_changes =
  "Changes do not affect form, fit, function or materials with no impact on risk, safety or effectiveness",
  equivalent_changes =
  // eslint-disable-next-line max-len
  "Changes are equivalent to current design with no impact on risk, safety or effectiveness. Equivalency established through design verification",
}

export enum ProcessAssessmentReasoningOption {
  not_affect_changes =
  "Changes do not affect bioburden, sterilization, or validated state and are covered by existing QC methods",
}

export enum RegulatoryAssessmentReasoningOption {
  no_approvals = "No current product approvals",
  no_submissions = "No current submissions",
  not_certified = "Quality System not certified",
}

export type AssessmentReasoningType = {
  [key in AssessmentType]: any;
};

export const AssessmentReasoningOption: AssessmentReasoningType = {
  design: DesignAssessmentReasoningOption,
  process: ProcessAssessmentReasoningOption,
  regulatory: RegulatoryAssessmentReasoningOption,
};

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
export interface SummaryDispatchProps {
  save: typeof changeRequestsActions.save;
  closeTask: typeof changeRequestsActions.closeTask;
  loadGroupsByStage: typeof documentRevisionsActions.loadGroupsByStage;
}

// Common
export type ChangeRequestsUserProps = ActionProps & AuthProps & {
  tableName: string;
  clearFilter: () => void;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<ChangeRequest>;
};
export type ChangeRequestUserProps = DataProps<ChangeRequest> & AuthProps;

export interface RouteParams {
  changeRequestId: string;
}

export interface RouteParamsCreate {
  documentTypeId: string;
  formId: string;
}

export interface ActionProps {
  editChangeRequest: (changeRequestId: string) => void;
  previewChangeRequest: (changeRequestId: string) => void;
}

export interface ReasoningOption {
  key: string;
  value: string;
  text: string;
}
