import { concat, uniqBy } from "lodash";
import React from "react";
import { DocumentRevision, SmartReferenceType } from "../../../../state/ducks/documentRevisions/types";
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from "../../../documentRevision/helpers/checkDocumentGroup";

const LHR_BUILD_TYPE = "lhr-build-type";
const LHR_SUBTITLE_PRECALC_KEY = "lshs_subtitle";

const LABEL_LENGTH = 50;
const generateDocRevUrl: (params: {docRevId: string; documentId: string; label: string}) => any =
  ({ docRevId, documentId, label }) => (
    <a
      href={`/document_revision/${documentId}/version/${docRevId}`}
      target={"_self"}
      rel="noopener noreferrer">
      {label.length < LABEL_LENGTH ? label : `${label.substr(0, LABEL_LENGTH - 3)}...`}
    </a>);

const generateLHRSubtitle = (documentRevision: DocumentRevision) => <React.Fragment>
  {`${documentRevision.document?.lot?.lotId}${documentRevision.formInput?.[LHR_BUILD_TYPE] === "R&D" ? "RD" : ""}`}
</React.Fragment>;

const generateLHRsSubtitle = (documentRevision: DocumentRevision) => {
  const subtitle =
    uniqBy(
      concat(documentRevision?.smartReferencesTo, documentRevision?.document.smartReferencesTo),
      "id"
    )
    ?.find((ref) => ref?.type === SmartReferenceType.HiddenPiInstance)
    ?.toDocRev
    ?.precalc
    ?.[LHR_SUBTITLE_PRECALC_KEY];

  const partLink = subtitle?.part?.docRevId && subtitle?.part?.documentId && generateDocRevUrl(subtitle.part);
  const lhrLink = subtitle?.lhr?.docRevId && subtitle?.lhr?.documentId && generateDocRevUrl(subtitle.lhr);
  const lotLabel = subtitle?.lot?.label && <span>{subtitle?.lot?.label}</span>;

  return <React.Fragment>
    {lotLabel}
    {lhrLink && " | "}
    {lhrLink}
    {partLink && " | "}
    {partLink}
  </React.Fragment>;
};

export const generateSubtitle = (documentRevision: DocumentRevision) => {
  if (checkIsDocumentMPIOutput(documentRevision.document.documentType.groupOptions)) {
    return generateLHRsSubtitle(documentRevision);
  }
  if (checkIsDocumentLHR(documentRevision.document.documentType.groupOptions)) {
    return generateLHRSubtitle(documentRevision);
  }
  return null;
};
