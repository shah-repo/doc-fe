import { RouteComponentProps } from "react-router-dom";
import { AuthProps } from "../../../state/ducks/auth/types";
import {
  DocumentRevisionProps,
  documentRevisionsActions,
  DocumentRevisionsProps,
} from "../../../state/ducks/documentRevisions";
import { LoadAsyncState } from "../../../state/types";

// Container
export type ContainerProps = ContainerOwnProps & ContainerDispatchProps & ContainerStateProps;
export type ContainerOwnProps = RouteComponentProps<RouteParams>;
export type ContainerStateProps = LoadAsyncState & DocumentRevisionProps;

export interface ContainerDispatchProps {
  load: typeof documentRevisionsActions.load;
}

// List
export type ListProps = ListDispatchProps & ListStateProps;
export type ListOwnProps = RouteComponentProps;
export type ListStateProps = DocumentRevisionsProps & LoadAsyncState & AuthProps;

export interface ListDispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

// Common
export type DocumentRevisionUserProps = DocumentRevisionProps & AuthProps;
export type DocumentRevisionsUserProps = DocumentRevisionsProps & ActionProps & AuthProps;

export interface RouteParams {
  documentRevisionId: string;
  documentId: string;
}

export interface ActionProps {
  editDocumentRevision: (documentRevisionId: string, documentId: string) => void;
  previewDocumentRevision: (documentRevisionId: string, documentId: string) => void;
}
