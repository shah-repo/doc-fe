import { RouteComponentProps } from "react-router-dom";
import { AuthProps } from "../../../state/ducks/auth/types";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { LoadAsyncState } from "../../../state/types";

// Container
export type ContainerProps = ContainerOwnProps & ContainerDispatchProps & ContainerStateProps;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;
export type ContainerStateProps = LoadAsyncState & DataProps<DocumentRevision>;

export interface ContainerDispatchProps {
  load: typeof documentRevisionsActions.load;
}

// List
export type ListProps = ListDispatchProps & ListStateProps;
export type ListOwnProps = RouteComponentProps;
export type ListStateProps = DataProps<DocumentRevision[]> & LoadAsyncState & AuthProps;

export interface ListDispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
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
export type DocumentRevisionUserProps = DataProps<DocumentRevision> & AuthProps;
export type DocumentRevisionsUserProps = DataProps<DocumentRevision[]> & ActionProps & AuthProps;

export interface RouteParams {
  documentRevisionId: string;
  documentId: string;
}

export interface ActionProps {
  editDocumentRevision: (documentRevisionId: string, documentId: string) => void;
  previewDocumentRevision: (documentRevisionId: string, documentId: string) => void;
}
