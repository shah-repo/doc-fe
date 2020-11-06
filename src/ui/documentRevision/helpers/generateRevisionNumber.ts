import { DocumentRevisionStatus, RevisionChangeType } from "../../../state/ducks/documentRevisions";

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
  if (revisionChangeType === RevisionChangeType.Obsolete && !isRecord) {
    return "OBS";
  }

  /** Subrevision should only be displayed in the doc revision table if a document is in draft.
   * If revisionStatus parameter is not passed to this function, status condition will be ignored. */
  const isInDraft = revisionStatus === DocumentRevisionStatus.Draft;
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
