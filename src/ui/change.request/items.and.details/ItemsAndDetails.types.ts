import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { FBFormProps, FBWorkspaceMode } from "../../form.builder";

export interface FBDocumentRevisionResponse {
  companyId: string;
  createdAt: string;
  displayRevision: string;
  document: {
    docId:  string;
    id: string;
    documentType: {
      group: string;
    };
  };
  id: string;
  name: string;
  updatedAt: string;
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
}
