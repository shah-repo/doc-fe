import { DocumentStatus } from "../../state/ducks/documents";

import {
  DispatchProps as DashboardContainerDispatchProps,
  StateProps as DashboardContainerStateProps,
} from "./Dashboard.container";

export type DashboardPresenterParentProps = DashboardContainerStateProps & DashboardContainerDispatchProps;

export interface DocumentActionProps {
  editDocument: (documentId: string) => () => void;
  previewDocument: (documentId: string) => () => void;
  cloneDocument: (documentId: string) => () => void;
}

export interface DocumentListItem {
  id: string;
  title: string;
  type: string;
  owner: string;
  state: DocumentStatus;
}
