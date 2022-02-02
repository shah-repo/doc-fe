import { DocumentRevisionFormProps, SMTabsHOCProps } from "../../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";

export type DocumentRevisionSummaryProps =
& SMTabsHOCProps
& Pick<Partial<DocumentRevisionFormProps>,
| "onTabChange"
| "onScroll"
| "_documentRevisionFormState"
| "schema">
& {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  isFB?: boolean;
};

