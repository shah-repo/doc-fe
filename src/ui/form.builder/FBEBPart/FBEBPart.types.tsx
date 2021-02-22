import { FBAutocompleteAsyncProps, FBInputProps, FBProviderProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { Document } from "../../../state/ducks/documents";

export type FBEBPartProps =
& Pick<FBProviderProps, "dialogState" | "ebPartState" | "formState">
& Pick<FBInputProps, "name" | "label" | "disabled" | "loading" | "defaultValue">
& FBAutocompleteAsyncProps
& {
  handleAdd?: () => void;
  partType?: "document" | "documentRevision";
  childrenParts?: DocumentRevision[];
  childrenPartsForRevise?: Document[];
  partTypeDefaultValue?: string;
  childForReviseValue?: string;
  childrenPartsValue?: string;
};

export interface EBPartPatchBody {
  childrenParts: EBPartRequestBody[];
  formInput?: {
    childrenPartsForRevise?: EBPartRequestBody[];
  };
}

export interface EBPartRequestBody {
  id: string;
}

export interface EBPartPostBody {
  description: string;
  document: {
    docId: string;
    documentType: {
      id: string;
    };
  };
  name: string;
  revisionStage: number;
  parentParts: {
    id: string;
  }[];
}

export interface ProposedDocIdBody {
  docId: string;
}

export enum PartType {
  Document = "document",
  DocumentRevision = "documentRevision",
}
