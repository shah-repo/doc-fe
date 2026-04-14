import { concat, uniqBy } from 'lodash';
import { FBFormState } from '..';
import { DocumentRevision, SmartReferenceType } from '../../../state/ducks/documentRevisions/types';

const LHR_SUBTITLE_PRECALC_KEY = 'lshs_subtitle';
export const LHRS_ACCEPTED_QUANTITY = 'lhrs-accepted-quantity';
export const LHRS_START_QUANTITY = 'lhrs-start-quantity';
export const LHRS_REJECTED_QUANTITY = 'lhrs-rejected-quantity';
export const LHRS_START_DATE = 'lhrs-start-date';
export const LHRS_END_DATE = 'lhrs-end-date';
export const MPI_PROCEDURE_BUILT_IN_ATTACHMENTS = 'mpi-procedure-built-in.attachments';

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

export const isLhrInvalid = (
  name: string,
  value: unknown,
  formState?: FBFormState,
): boolean => {
  const start = formState?.getFieldValue(LHRS_START_QUANTITY) as number | undefined;
  const accepted = (formState?.getFieldValue(LHRS_ACCEPTED_QUANTITY) as number) || 0;
  const rejected = (formState?.getFieldValue(LHRS_REJECTED_QUANTITY) as number) || 0;
  const inputValue = Number(value ?? 0);

  if (name === LHRS_ACCEPTED_QUANTITY) {
    return (start ?? 0) !== inputValue + rejected;
  }

  if (name === LHRS_REJECTED_QUANTITY) {
    return (start ?? 0) !== accepted + inputValue;
  }

  return false;
};

/**
 * Removes static and dynamic LHR date field keys from form values
 * Static keys: 'lhrs-start-date', 'lhrs-end-date'
 * Dynamic keys: 'lhrs-start-date-{uuid}', 'lhrs-end-date-{uuid}'
 */
export const cleanupLHRDateFields = (values: Record<string, any> | undefined): void => {
  if (!values) {
    return;
  }

  Object.keys(values).forEach((key) => {
    if (key === LHRS_START_DATE
        || key === LHRS_END_DATE
        || key.startsWith(`${LHRS_START_DATE}-`)
        || key.startsWith(`${LHRS_END_DATE}-`)) {
      delete values[key];
    }
  });
};
