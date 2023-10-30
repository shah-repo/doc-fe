import { get } from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import { translate } from '../../../common/intl';
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

const ATTRIBUTE_CHANGES_KEY = 'attribute-changes';
export const BOM_LINE_CHANGES_KEY = 'bom-line-changes';
export const BOM_FIELDS_CHANGES_KEY = 'bom-fields-edit';
const APPROVED_SUPPLIER_LIST_KEY = 'approved-supplier-list';
const CHANGES_TO_ATTACHMENTS_KEY = 'changes-to-attachments';
const CHANGES_TO_REFERENCES_KEY = 'changes-to-references';
export const SUBSTITUTING_SUPERSEDED_KEY = 'substituting-superseded';
export const CHANGE_CONTROL_CONFIG_DOC_TYPE_NAME = 'Change Control Configuration';

export const CHANGE_CONTROL_OPTIONS_TOOLTIP_MAPPING = {
  [ATTRIBUTE_CHANGES_KEY]: translate('ccc.attribute.changes.tooltip'),
  [BOM_LINE_CHANGES_KEY]: translate('ccc.bom.line.changes.tooltip'),
  [BOM_FIELDS_CHANGES_KEY]: translate('ccc.bom.selected.fields.changes.tooltip'),
  [APPROVED_SUPPLIER_LIST_KEY]: translate('ccc.approved.supplier.list.changes.tooltip'),
  [CHANGES_TO_ATTACHMENTS_KEY]: translate('ccc.changes.to.attachments.tooltip'),
  [CHANGES_TO_REFERENCES_KEY]: translate('ccc.changes.to.references.tooltip'),
};
// Disabled because of ENC-7826
/* export const shouldHaveNoResponse = (dataToSubmit: any, documentRevision: DocumentRevision) => {
  const schema = get(documentRevision, "formDocument.formTemplate.schema");
  const fieldsWithNoResponse = schema?.filter((item) => item.type === "texteditor" && !item.deleted);
  const getFormInputHasTextField = fieldsWithNoResponse?.find((field) => has(dataToSubmit.formInput, field.name));
  return has(dataToSubmit, "description") || getFormInputHasTextField;
}; */

export const cccKeyNamesOrder = ['attribute-changes', 'bom-line-changes', 'bom-fields-edit', 'approved-supplier-list',
  'changes-to-attachments', 'changes-to-references', 'substituting-superseded', 'auto-update-child-rev'];

// Based on the controlOptions - if attribute-changes is set to yes,
// then editing any of these will need a new revision
export const formFieldsDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, ATTRIBUTE_CHANGES_KEY);
};

export const suppliersDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, APPROVED_SUPPLIER_LIST_KEY);
};

export const attachmentsDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, CHANGES_TO_ATTACHMENTS_KEY);
};

export const referencesDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, CHANGES_TO_REFERENCES_KEY);
};

export const bomDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, BOM_LINE_CHANGES_KEY);
};

export const substitutingSupersededDisabledChangeControl = (documentRevision: DocumentRevision | undefined): boolean => {
  return doesFieldChangeAffectRev(documentRevision, SUBSTITUTING_SUPERSEDED_KEY);
};

export const getEnabledFieldsForEditing = (documentRevision: DocumentRevision | undefined): string[] => {
  let fieldNames: string[] = ['refDesignator', 'comment', 'quantity', 'unit', 'alternatePart'];
  if (documentRevision?.isBeingEditedAfterRelease
    && documentRevision?.changeControlOptions
    && documentRevision?.changeControlOptions.formInput) {
    if (documentRevision?.changeControlOptions.formInput[BOM_LINE_CHANGES_KEY] === 'Yes') {
      fieldNames = [];
    } else {
      fieldNames = documentRevision?.changeControlOptions.formInput[BOM_FIELDS_CHANGES_KEY] ?? [];
    }
  }
  return fieldNames;
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
