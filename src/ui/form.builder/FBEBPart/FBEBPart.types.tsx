import { FBAutocompleteAsyncProps, FBInputProps, FBProviderProps } from "..";

export type FBEBPartProps =
& Pick<FBProviderProps, "dialogState" | "ebPartState">
& Pick<FBInputProps, "name" | "label" | "disabled" | "loading" | "defaultValue">
& FBAutocompleteAsyncProps
& {
  handleAdd?: () => void;
  partType?: "document" | "documentRevision";
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
