import { filter } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { useSelector } from 'react-redux';
import { FB, FBAutocomplete, FBData, FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from '..';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import OverflowTooltip from '../../components/OverflowTooltip';
import { checkIfDocumentHasOptions } from '../../documentRevision/helpers/checkDocumentGroup';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import FBFormState from '../FBForm/FBForm.state';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorTextField.styles';
import { documentRevisionStatusOptions, EXCLUDED_DOCUMENT_OPTIONS } from './FBEditorAutocomplete.consts';
import useStyles from './FBEditorAutocomplete.styles';

const FBEditorAutocomplete: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type = 'autocomplete', index = 0 } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  const formState = FB.useRef<FBFormState>(FBFormState, { initialValues: inputProps });
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
        labelProps={AutoCompleteStyles.labelProps}
        inputPropStyle={{}}
        autoCompleteClasses={{
          endAdornment: customClasses.endAdornment,
          inputRoot: customClasses.inputRoot,
          input: customClasses.input,
        }}
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
            inputPropStyle={{}}
            autoCompleteClasses={{
              endAdornment: customClasses.endAdornment,
              inputRoot: customClasses.inputRoot,
              input: customClasses.input,
            }}
            getTagLabel={(option) => <OverflowTooltip title={option.documentTypeName} arrow>{option.documentTypeName}</OverflowTooltip>}
            multiple
          />
          <FBAutocomplete
            label="common.status"
            options={documentRevisionStatusOptions}
            optionLabelKey="label"
            optionValueKey="id"
            name="documentStatuses"
            autoCompleteClasses={{
              endAdornment: customClasses.endAdornment,
              inputRoot: customClasses.inputRoot,
              input: customClasses.input,
            }}
            getTagLabel={(option) => <OverflowTooltip title={option.label} arrow>{option.label}</OverflowTooltip>}
            multiple
          />
        </>
      )}
      {children}
    </FBEditor>
  );
};

export default FBEditorAutocomplete;
