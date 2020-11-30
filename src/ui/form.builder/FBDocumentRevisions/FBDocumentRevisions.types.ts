import { FBAutocompleteProps, FBInputProps } from "..";
import { FBProviderProps } from "../FBProvider";

export type FBDocumentRevisionsProps =
& Pick<FBInputProps, "name" | "disabled" | "gutter" | "index">
& Pick<FBProviderProps, "docRevState" | "dialogState" | "formState">
& {
  handleForm: () => void;
  handleAdd: () => void;
  handleCancel: () => void;
  handleOpen?: (index: number) => void;
  remove?: (index: number) => void;
  collection?: FBDocumentRevisionsValue[];
};

export type FBDocumentRevisionsItemProps =
& Pick<FBInputProps, "name" | "disabled" | "index">
& Pick<FBDocumentRevisionsProps, "handleOpen" | "remove">
& {
  id: string;
};

export interface FBDocumentRevisionsValue {
  id: string;
  proposedDocumentRevision: {
    id: string;
  };
  justificationOfChange: string;
  descriptionOfChange: string;
}

export type FBDocumentRevisionsFormProps =
& Pick<FBProviderProps, "formState">
& Pick<FBAutocompleteProps, "disabledOptions" | "renderOption" >;

export type FBDocumentRevisionsActionsProps =
& Pick<FBDocumentRevisionsProps, "handleAdd" | "handleCancel">;
