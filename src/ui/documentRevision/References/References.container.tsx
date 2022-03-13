import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ReferencesPresenter from "./References.presenter";

interface ReferencesProps {
  selectedDocument: DocumentRevision | undefined;
  edit: boolean | undefined;
}

const ReferencesContainer = ({
  selectedDocument,
  edit,
}: ReferencesProps) => (
  <ReferencesPresenter
    selectedDocument={selectedDocument}
    edit={edit}
  />
);

export default ReferencesContainer;
