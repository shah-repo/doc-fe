import { RouteComponentProps } from "react-router-dom";
import { AuthProps } from "../../../state/ducks/auth/types";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, documentRevisionsActions, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { documentsActions } from "../../../state/ducks/documents";
import { TrainingRecord } from "../../../state/ducks/training";
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
export type ListStateProps = DataProps<DocumentRevision[]> & AuthProps & {
  documentTypeOptions: SelectOption[];
};

export interface ListDispatchProps {
  setDocId: typeof documentsActions.setDocumentProposedId;
}

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

// Summary
export type SummaryStateProps = LoadAsyncState & DataProps<DocumentRevision[]>;

export interface SummaryDispatchProps {
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

export interface SummaryOwnProps {
  documentId: string;
  documentRevisionId: string | null;
  isNewVersion: boolean;
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

export interface ActionProps {
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

export interface BuildsSummary {
  id: string;
  url: string;
  docId?: string;
  title: string;
  revisionStage?: number;
}

export interface TrainingControlProps extends DataProps<TrainingRecord[]> {
  documentRevisionId: string;
}
