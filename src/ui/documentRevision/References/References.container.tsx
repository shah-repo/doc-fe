import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { generateRevisionNumber } from "../helpers/generateRevisionNumber";
import ReferencesPresenter from "./References.presenter";

interface ReferencesProps {
  selectedDocument: DocumentRevision | undefined;
}

const ReferencesContainer = ({
  selectedDocument,
}: ReferencesProps) => {
  const {
    revision,
    subRevision,
    revisionStage,
    revisionChangeType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effectiveDate,
  } = selectedDocument?.formDocument || {};

  const version = generateRevisionNumber(revision, revisionStage as number, subRevision, revisionChangeType);

  const docId = selectedDocument?.formDocument?.document?.docId;
  const formDocument = {
    version,
    effectiveDate,
    docId,
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
      retrain={selectedDocument?.retrain}
    />
  );
};

export default ReferencesContainer;
