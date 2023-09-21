import { get } from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import { checkIsDocumentRecord } from '../../documentRevision/helpers/checkDocumentGroup';
import { isDocumentRevisionInDraft, isDocumentRevisionPendingChange } from '../../documentRevision/helpers/documentRevisionStatus';
import { generateRevisionNumber } from '../../documentRevision/helpers/generateRevisionNumber';
import { CompletedOnDateOptions, ReleasedDateOptions } from './types';

export const canEditDocumentRevision = (documentRevision: DocumentRevision) => {
  const owner = get(documentRevision, 'owner.user.email');
  const currentUser = store.getState().auth.user.email;
  return (
    currentUser === owner
    && (isDocumentRevisionInDraft(documentRevision) || isDocumentRevisionPendingChange(documentRevision))
  );
};

export const documentRevisionQueryStatus = (): DocumentRevisionStatus[] =>
  Object
    .values(DocumentRevisionStatus)
    .filter((value) => value !== DocumentRevisionStatus.Deprecated && value !== DocumentRevisionStatus.Canceled);

export const documentRevisionEffectiveDateOption = () => [
  {
    text: ReleasedDateOptions.LAST_WEEK,
    value: moment().subtract(7, 'd').startOf('day').toISOString(),
  },
  {
    text: ReleasedDateOptions.LAST_TWO_WEEKS,
    value: moment().subtract(14, 'd').startOf('day').toISOString(),
  },
  {
    text: ReleasedDateOptions.LAST_MONTH,
    value: moment().subtract(30, 'd').startOf('day').toISOString(),
  },
];

export const dueDateOption = () => [
  {
    text: CompletedOnDateOptions.NEXT_WEEK,
    value: moment().add(7, 'd').startOf('day').toISOString(),
  },
  {
    text: CompletedOnDateOptions.OVERDUE,
    value: moment().endOf('day').toISOString(),
  },
];

export const trainingCompletedOnDateOption = () => [
  {
    text: ReleasedDateOptions.LAST_WEEK,
    value: moment().subtract(7, 'd').startOf('day').toISOString(),
  },
  {
    text: ReleasedDateOptions.LAST_TWO_WEEKS,
    value: moment().subtract(14, 'd').startOf('day').toISOString(),
  },
  {
    text: ReleasedDateOptions.LAST_MONTH,
    value: moment().subtract(30, 'd').startOf('day').toISOString(),
  },
  {
    text: CompletedOnDateOptions.PENDING,
    // sending in the feature, BE will recognize pending
    value: moment().add(7, 'd').startOf('day').toISOString(),
  },
];

export const getVersionNumber = (documentRevisionId) => {
  const {
    document: {
      documentType: {
        groupOptions = [],
      },
    }, revision, revisionStage, revisionChangeType, subRevision,
  } = store.getState().documentRevisions.byId[documentRevisionId];

  return generateRevisionNumber(revision, revisionStage, subRevision, revisionChangeType, undefined,
    checkIsDocumentRecord(groupOptions),
  );
};

export const getLatestRevisionId = (revisions: DocumentRevision[] = []): string | undefined => {
  const sortedRevisions
    = revisions
      .filter(revision => revision.status !== DocumentRevisionStatus.Canceled)
      .sort((a, b) => b.version - a.version);
  return sortedRevisions.at(0)?.id;
};

export const statesWithLastSavedEnabled = [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange];

// Disabled because of ENC-7826
/* export const shouldHaveNoResponse = (dataToSubmit: any, documentRevision: DocumentRevision) => {
  const schema = get(documentRevision, "formDocument.formTemplate.schema");
  const fieldsWithNoResponse = schema?.filter((item) => item.type === "texteditor" && !item.deleted);
  const getFormInputHasTextField = fieldsWithNoResponse?.find((field) => has(dataToSubmit.formInput, field.name));
  return has(dataToSubmit, "description") || getFormInputHasTextField;
}; */

// Based on the controlOptions - if attribute-changes is set to yes,
// then editing any of these will need a new revision
export const formFieldsDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, 'attribute-changes');
};

export const suppliersDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, 'approved-supplier-list');
};

export const attachmentsDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, 'changes-to-attachments');
};

export const referencesDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, 'changes-to-references');
};

export const bomDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, 'bom-line-changes');
};

export const substitutingSupersededDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, 'substituting-superseded');
};

export const disableOtherFieldsChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  let disableOtherFields = false;
  if (documentRevision?.isBeingEditedAfterRelease && documentRevision?.changeControlOptions?.id !== '') {
    disableOtherFields = true;
  }
  return disableOtherFields;
};

const doesFieldChangeAffectRev = (documentRevision: DocumentRevision | undefined, field: string) => {
  let fieldChangeAffectsRev = false;
  if (documentRevision?.isBeingEditedAfterRelease
    && documentRevision?.changeControlOptions
    && documentRevision?.changeControlOptions.formInput) {
    fieldChangeAffectsRev = documentRevision.changeControlOptions.formInput[field] === 'Yes';
  }
  return fieldChangeAffectsRev;
};
