import { FBInputProps, FBProviderProps } from "..";

export type FBSupplierProps =
& Pick<FBProviderProps, "dialogState" | "supplierState">
& Pick<FBInputProps, "name" | "label" | "disabled" | "loading" | "isInputOwner">
& {
  handleAdd(): void;
  isPreview?: boolean;
};

export interface SupplierPostBody {
  description: string;
  document: {
    docId: string;
    documentType: {
      id: string;
    };
  };
  formDocument: {
    id: string;
  };
  name: string;
  revisionStage: number;
}
