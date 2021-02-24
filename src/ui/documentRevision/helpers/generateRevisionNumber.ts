import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { isDocumentRevisionInDraft } from "./documentRevisionStatus";

const getAlphabetFromNumber = (num: number) => {
  let str = "";

  const multiples = Math.ceil(num / 26);
  const charAtCode = num - (multiples - 1) * 26;

  for (let i = 0; i < multiples; i++) {
    str += String.fromCharCode(charAtCode + 64);
  }

  return str;
};

export const generateRevisionNumber = (
  revision?: number,
  revisionStage?: number,
  subRevision?: number,
  revisionChangeType?: RevisionChangeType,
  revisionStatus?: DocumentRevisionStatus,
  isRecord = false,
) => {
  if (!revision || !revisionStage) {
    return "";
  }
  if (revisionChangeType === RevisionChangeType.Void) {
    return "Void";
  }
  if (revisionChangeType === RevisionChangeType.Obsolete) {
    return isRecord ? "Void" : "OBS";
  }

  /** Subrevision should only be displayed in the doc revision table if a document is in draft.
   * If revisionStatus parameter is not passed to this function, status condition will be ignored. */
  const isInDraft = isDocumentRevisionInDraft(revisionStatus);
  const suffix = (isInDraft || !revisionStatus) && subRevision && subRevision > 0
    ? `.${subRevision}`
    : "";

  switch (revisionStage) {
    case 1: {
      return `${revision}${suffix}`;
    }
    case 2:
      return `1${getAlphabetFromNumber(revision)}${suffix}`;
    case 3:
      return `${getAlphabetFromNumber(revision)}${suffix}`;
    default:
      return "N/A";
  }
};

/**
 * Generates parameters required for generating version number
 * It is used for revision change type prediction
 * @param revisionChangeType selected change for which we generate parameters
 * @param releasedDocRev released doc rev if there is one
 * @param numOfStages number of stages from company config
 * @param isRecord flag is doc a record
 */
export const versionNumber = (
  revisionChangeType: RevisionChangeType,
  numOfStages: number,
  releasedDocRev?: DocumentRevision,
  isRecord?: boolean,
) => {
  if (!revisionChangeType) {
    // no change
    return "";
  }
  if (!releasedDocRev) {
    // this is first document
    switch (revisionChangeType) {
      case RevisionChangeType.NextRevision: {
        return generateRevisionNumber(
          1,
          1,
          0,
          revisionChangeType,
        );
      }
      case RevisionChangeType.NextRevisionStage: {
        const bumpValue = (numOfStages === 2) ? 2 : 1;
        return generateRevisionNumber(
          1,
          1 + bumpValue,
          0,
          revisionChangeType,
        );
      }
      default: {
        return "";
      }
    }
  }
  switch (revisionChangeType) {
    case RevisionChangeType.Obsolete: {
      return generateRevisionNumber(
        isRecord ? releasedDocRev.revision : releasedDocRev.revision + 1,
        releasedDocRev.revisionStage,
        isRecord ? ((releasedDocRev.subRevision || 0) + 1) : 0,
        revisionChangeType,
      );
    }
    case RevisionChangeType.NextRevision: {
      return generateRevisionNumber(
        releasedDocRev.revision + 1,
        releasedDocRev.revisionStage,
        0,
        revisionChangeType,
      );
    }
    case RevisionChangeType.NextRevisionStage: {
      const bumpValue = (numOfStages === 2) ? 2 : 1;
      return generateRevisionNumber(
        1,
        releasedDocRev.revisionStage + bumpValue,
        0,
        revisionChangeType,
      );
    }
    case RevisionChangeType.AdministrativeChange: {
      return generateRevisionNumber(
        releasedDocRev.revision,
        releasedDocRev.revisionStage,
        (releasedDocRev.subRevision || 0) + 1,
        revisionChangeType,
      );
    }
    default: {
      return "";
    }
  }
};

