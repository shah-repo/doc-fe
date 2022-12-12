import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { AsyncActionPayload } from "../../../state/types";
import { FBFormProps, FBWorkspaceMode } from "../../form.builder";

export interface FBDocumentRevisionResponse {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
  displayRevision: string;
  docId: string;
  documentId: string;
  documentTypeId: string;
  group: DOC_TYPE_GROUP;
}

export interface FBDocumentRevisionsValue {
  id: string;
  proposedDocumentRevision: {
    id: string;
  };
  justificationOfChange: string;
  descriptionOfChange: string;
}

export interface ChangeOrderGridItem {
  id: string;
  docRevId: string;
  documentId: string;
  justificationOfChange: string;
  descriptionOfChange: string;
  titleText: string;
  displayRevision: string;
  isPart: boolean;
}

export type ChangeOrderViewItemProps =
& ChangeOrderGridItem;

export interface ItemsAndDetailsWrapperProps {
  changeRequest: ChangeRequest;
  initialValues: Pick<FBFormProps, "initialValues">;
  autosave: boolean;
  mode: FBWorkspaceMode;
  asyncState: AsyncActionPayload;
}
