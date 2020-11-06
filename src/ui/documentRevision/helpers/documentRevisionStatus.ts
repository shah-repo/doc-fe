import { some } from "lodash";
import { Document, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";

export const getIsLastVersionObsolete = (formDocuments: Document) =>
  some(formDocuments.documentRevisions, ["status", DocumentRevisionStatus.Obsolete ]);
