import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ReferencesPresenter from "./References.presenter";

interface ReferencesProps {
  selectedDocument: DocumentRevision | undefined;
}

const ReferencesContainer = ({
  selectedDocument,
}: ReferencesProps) => (
  <ReferencesPresenter
    owner={selectedDocument?.owner}
    status={selectedDocument?.status}
    referencedBy={selectedDocument?.children}
    deprecatedAt={selectedDocument?.deprecatedAt}
    referenceTo={selectedDocument?.referenceTo}
    released={selectedDocument?.releasedAt}
  />
);

export default ReferencesContainer;
