import { filter } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { useSelector } from 'react-redux';
import { FB, FBAutocomplete, FBData, FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from '..';
import { translate } from '../../../common/intl';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { checkIfDocumentHasOptions } from '../../documentRevision/helpers/checkDocumentGroup';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import FBFormState from '../FBForm/FBForm.state';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorTextField.styles';
import useStyles from './FBEditorAutocomplete.styles';

const EXCLUDED_DOCUMENT_OPTIONS = [
  DOC_TYPE_GROUP_OPTION.CHANGE_REQUEST,
];

const EXCLUDED_DOCUMENT_REVISION_STATUS = [
  DocumentRevisionStatus.Canceled,
  DocumentRevisionStatus.Deprecated,
  DocumentRevisionStatus.Obsolete,
  DocumentRevisionStatus.Voided,
];

const DOCUMENT_REVISION_STATUS_LABELS: Partial<Record<DocumentRevisionStatus, string[]>> = {
  [DocumentRevisionStatus.Draft]: [
    translate('DRAFT'),
    translate('common.wip'),
  ],
  [DocumentRevisionStatus.InReview]: [
    translate('IN_REVIEW'),
  ],
  [DocumentRevisionStatus.PendingChange]: [
    translate('PENDING_CHANGE'),
  ],
  [DocumentRevisionStatus.Approved]: [
    translate('APPROVED'),
  ],
  [DocumentRevisionStatus.Released]: [
    translate('RELEASED'),
    translate('common.completed'),
    translate('common.last.signed'),
  ],
};

const documentRevisionStatusOptions = Object.values(DocumentRevisionStatus)
  .filter((status) => !EXCLUDED_DOCUMENT_REVISION_STATUS.includes(status) && DOCUMENT_REVISION_STATUS_LABELS[status])
  .map((status) => ({
    id: status,
    label: DOCUMENT_REVISION_STATUS_LABELS[status]?.join('/'),
  }));

const FBEditorAutocomplete: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type = 'autocomplete', index = 0 } = {},
  inputProps,
  ...props
}) => {
  const formState = FB.useRef<FBFormState>(FBFormState, { initialValues: inputProps });
  const classes = styles();
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeFormOptions);
  const customClasses = useStyles();

  const documentTypeOptions = documentTypes.filter((documentType) => {
    return documentType.active && !checkIfDocumentHasOptions(
      [
        ...EXCLUDED_DOCUMENT_OPTIONS,
      ],
      documentType.groupOptions,
    );
  });

  const optionId = useObserver(
    () => (formState?.newValues.get('optionId') ?? formState?.getFieldValue('optionId')) as string | undefined,
  );

  return (
    <FBEditor {...props} {...{ inputProps, formState }}>
      <FBTextField label="form.builder.label" name="label" rules="required" className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
        isFbEditorField
      />
      <FBEditorPlaceholder key={`fb-editor-placeholder-${type}-${index}`}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
        className={classes.textfield}
        isFbEditorField
      />
      <FBAutocomplete
        label="form.builder.select.options"
        options={filter(FBData.autocompleteOptions, { hidden: false })}
        optionLabelKey="label"
        optionValueKey="id"
        name="optionId"
        key={`fb-editor-${type}-${index}`}
        rules="required"
        inputPropStyle={AutoCompleteStyles.inputPropStyle}
        labelProps={AutoCompleteStyles.labelProps}
        inputPropStyleSize="small"
        withState
      />
      {optionId === FBAutocompleteAsyncOption.allDocuments && (
        <>
          <FBAutocomplete
            label="common.document.types"
            options={documentTypeOptions}
            optionLabelKey="documentTypeName"
            optionValueKey="id"
            name="docTypeIds"
            autoCompleteClasses={{
              root: 'custom-autocomplete-root',
              input: 'custom-autocomplete-input',
              endAdornment: customClasses.endAdornment,
            }}
            multiple
          />
          <FBAutocomplete
            label="common.status"
            options={documentRevisionStatusOptions}
            optionLabelKey="label"
            optionValueKey="id"
            name="documentStatuses"
            autoCompleteClasses={{
              root: 'custom-autocomplete-root',
              input: 'custom-autocomplete-input',
              endAdornment: customClasses.endAdornment,
            }}
            multiple
          />
        </>
      )}
      {children}
    </FBEditor>
  );
};

export default FBEditorAutocomplete;
