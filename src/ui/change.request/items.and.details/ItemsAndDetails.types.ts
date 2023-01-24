import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { AsyncActionPayload } from "../../../state/types";
import { FBFormProps, FBWorkspaceMode } from "../../form.builder";

export interface FBDocumentRevisionResponse {
  createdAt: string;
  updatedAt: string;
  displayRevision: string;
  id: string;
  name: string;
  document: {
    docId: string;
    id: string;
    documentType: {
      group: DOC_TYPE_GROUP;
      id: string;
    };
  };
}

export interface FBDocumentRevisionsValue {
  id: string;
  proposedDocumentRevision: {
    id: string;
  };
  justificationOfChange: string;
  descriptionOfChange: string;
}

export interface ApprovalRequestGridItem {
  id: string;
  docRevId: string;
  documentId: string;
  justificationOfChange: string;
  descriptionOfChange: string;
  titleText: string;
  displayRevision: string;
  isPart: boolean;
}

export interface ItemsAndDetailsWrapperProps {
  currentDocRevId?: string;
  changeRequest?: ChangeRequest;
  initialValues: Pick<FBFormProps, "initialValues">;
  autosave: boolean;
  mode: FBWorkspaceMode;
  asyncState?: AsyncActionPayload;
}
