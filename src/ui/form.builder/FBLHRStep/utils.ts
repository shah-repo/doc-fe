import { concat, uniqBy } from 'lodash';
import { DocumentRevision, SmartReferenceType } from '../../../state/ducks/documentRevisions/types';

const LHR_SUBTITLE_PRECALC_KEY = 'lshs_subtitle';

export const generateLHRsDocs = (documentRevision?: DocumentRevision) => {
  const allReferences = concat(
    documentRevision?.smartReferencesTo ?? [],
    documentRevision?.document.smartReferencesTo ?? [],
  );
  const parentLHRReference = uniqBy(allReferences, 'id').find(
    ref => ref.active && ref.type === SmartReferenceType.HiddenPiInstance,
  );

  if (!parentLHRReference) {
    return null;
  }

  const parentLHR = parentLHRReference.toDocRev;
  const precalcLHR = parentLHR?.precalc?.[LHR_SUBTITLE_PRECALC_KEY]?.lhr;
  const documentId = precalcLHR?.documentId ?? parentLHR?.documentId;
  const docRevId = precalcLHR?.docRevId ?? parentLHR?.id;

  if (!documentId || !docRevId) {
    return null;
  }

  return (
    { docRevId, documentId }
  );
};
