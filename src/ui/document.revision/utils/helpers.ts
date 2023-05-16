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
    currentUser === owner &&
    (isDocumentRevisionInDraft(documentRevision) || isDocumentRevisionPendingChange(documentRevision))
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

  return generateRevisionNumber( revision, revisionStage, subRevision, revisionChangeType, undefined,
    checkIsDocumentRecord(groupOptions),
  );
};


export const statesWithLastSavedEnabled = [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange];

// Disabled because of ENC-7826
/* export const shouldHaveNoResponse = (dataToSubmit: any, documentRevision: DocumentRevision) => {
  const schema = get(documentRevision, "formDocument.formTemplate.schema");
  const fieldsWithNoResponse = schema?.filter((item) => item.type === "texteditor" && !item.deleted);
  const getFormInputHasTextField = fieldsWithNoResponse?.find((field) => has(dataToSubmit.formInput, field.name));
  return has(dataToSubmit, "description") || getFormInputHasTextField;
}; */
