import { FBAutocompleteAsyncProps, FBFormProps, FBInputProps, FBProviderProps } from "..";

export type FBEBPartProps =
& Pick<FBFormProps, "formState">
& Pick<FBProviderProps, "dialogState">
& Pick<FBInputProps, "name" | "label" | "disabled">
& FBAutocompleteAsyncProps
& {
  onAddClick(): void;
};

export interface EBPartPatchBody {
  childrenParts: { id: string }[];
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
  };
}

export interface ProposedDocIdBody {
  docId: string;
}
