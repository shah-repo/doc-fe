import { RouteComponentProps } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { TrainingRecord } from "../../../state/ducks/training/types";
import { LoadAsyncState } from "../../../state/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";

// Container
export type ContainerProps = ContainerOwnProps & ContainerDispatchProps & ContainerStateProps;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;
export type ContainerStateProps = LoadAsyncState & DataProps<DocumentRevision>;

export interface ContainerDispatchProps {
  load: typeof documentRevisionsActions.load;
}

// List
export type ListOwnProps = RouteComponentProps;

export enum ReleasedDateOptions {
  LAST_WEEK = "Last 7 days",
  LAST_TWO_WEEKS = "Last 14 days",
  LAST_MONTH = "Last 30 days",
}

export enum CompletedOnDateOptions {
  NEXT_WEEK = "Next 7 days",
  NEXT_TWO_WEEKS = "Next 14 days",
  NEXT_MONTH = "Next 30 days",
  PENDING = "Pending",
}

// Common
export type DocumentRevisionsUserProps = ActionProps & {
  documentTypeOptions: SelectOption[];
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<DocumentRevision>;
  clearFilter?: () => void;
  statuses: DocumentRevisionStatus[];
};

export interface RouteParams {
  documentRevisionId: string;
  documentId: string;
}

interface ActionProps {
  editDocumentRevision: (documentRevisionId: string, documentId: string) => void;
  previewDocumentRevision: (documentRevisionId: string, documentId: string) => void;
}

export interface ReferenceSummary {
  id: string;
  url: string;
  docId?: string;
  title: string;
  displayRevision?: string;
}

export interface TrainingControlProps extends DataProps<TrainingRecord[]> {
  documentRevisionId: string;
}
