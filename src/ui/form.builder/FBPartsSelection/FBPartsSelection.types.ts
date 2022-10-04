import { FBAutocompleteAsyncProps, FBAutocompleteProps, FBId } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBPartsSelectionProps =
& FBAutocompleteAsyncProps
& {
  isOutput?: boolean;
  editorConfig?: FBId;
  filteredOptions?: FBAutocompleteProps["filterOptions"];
  isDocumentLHR?: boolean;
  lhrSelectedPartValue?: string;
};


export type DocRevOption =
& Pick<Partial<DocumentRevision>, "displayRevision" | "displayStatus" | "docId" | "id" | "name" | "status">;
