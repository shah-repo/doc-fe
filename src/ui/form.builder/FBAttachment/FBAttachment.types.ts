import { FBInputProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";

export type FBAttachmentProps =
& FBInputProps
& {
  documentRevision: DocumentRevision;
  values: DocumentRevisionFormValues;
  isNewVersion: boolean;
};
