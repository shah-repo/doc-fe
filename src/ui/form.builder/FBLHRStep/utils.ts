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

export function isLhrQuantityValid (
  name: string,
  value: number,
  formState: any,
) {
  const startQuantity = formState?.getFieldValue('lhrs-start-quantity');
  const accepted = formState?.getFieldValue('lhrs-accepted-quantity') || 0;
  const rejected = formState?.getFieldValue('lhrs-rejected-quantity') || 0;

  if (
    (name === 'lhrs-accepted-quantity' && startQuantity < value + rejected)
    || (name === 'lhrs-rejected-quantity' && startQuantity < accepted + value)
  ) {
    return false;
  }
  return true;
}

export const isLhrError = (name, value, formState) => {
  const start = formState?.getFieldValue('lhrs-start-quantity');
  const accepted = formState?.getFieldValue('lhrs-accepted-quantity') || 0;
  const rejected = formState?.getFieldValue('lhrs-rejected-quantity') || 0;

  if (name === 'lhrs-accepted-quantity') {
    return start < Number(value) + rejected;
  }

  if (name === 'lhrs-rejected-quantity') {
    return start < accepted + Number(value);
  }

  return false;
};
