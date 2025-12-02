import { concat, uniqBy } from 'lodash';
import { FBFormState } from '..';
import { DocumentRevision, SmartReferenceType } from '../../../state/ducks/documentRevisions/types';

const LHR_SUBTITLE_PRECALC_KEY = 'lshs_subtitle';
const LHRS_ACCEPTED_QUANTITY = 'lhrs-accepted-quantity';
const LHRS_START_QUANTITY = 'lhrs-start-quantity';
const LHRS_REJECTED_QUANTITY = 'lhrs-rejected-quantity';

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
  formState?: FBFormState,
) {
  const startQuantity = formState?.getFieldValue(LHRS_START_QUANTITY);
  const accepted = formState?.getFieldValue(LHRS_ACCEPTED_QUANTITY) || 0;
  const rejected = formState?.getFieldValue(LHRS_REJECTED_QUANTITY) || 0;

  if (
    (name === LHRS_ACCEPTED_QUANTITY && startQuantity < value + rejected)
    || (name === LHRS_REJECTED_QUANTITY && startQuantity < accepted + value)
  ) {
    return false;
  }
  return true;
}

export const isLhrError = (name: string, value: number, formState?: FBFormState) => {
  const start = formState?.getFieldValue(LHRS_START_QUANTITY);
  const accepted = formState?.getFieldValue(LHRS_ACCEPTED_QUANTITY) || 0;
  const rejected = formState?.getFieldValue(LHRS_REJECTED_QUANTITY) || 0;

  if (name === LHRS_ACCEPTED_QUANTITY) {
    return start < Number(value) + rejected;
  }

  if (name === LHRS_REJECTED_QUANTITY) {
    return start < accepted + Number(value);
  }

  return false;
};
