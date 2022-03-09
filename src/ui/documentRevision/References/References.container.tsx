import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ReferencesPresenter from "./References.presenter";

interface ReferencesProps {
  selectedDocument: DocumentRevision | undefined;
}

const ReferencesContainer = ({
  selectedDocument,
}: ReferencesProps) => {
  const formDocument = {
    version: selectedDocument?.version,
    effectiveDate: selectedDocument?.effectiveDate,
    docId: selectedDocument?.document?.docId,
  };
  return (
    <ReferencesPresenter
      owner={selectedDocument?.owner}
      status={selectedDocument?.status}
      referencedBy={selectedDocument?.children}
      deprecatedAt={selectedDocument?.deprecatedAt}
      referenceTo={selectedDocument?.referenceTo}
      released={selectedDocument?.releasedAt}
      formDocument={formDocument}
    />
  );
};

export default ReferencesContainer;
