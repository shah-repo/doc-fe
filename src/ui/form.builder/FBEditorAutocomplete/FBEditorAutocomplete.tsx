import { filter } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { useSelector } from 'react-redux';
import { FB, FBAutocomplete, FBData, FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from '..';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import FBFormState from '../FBForm/FBForm.state';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorTextField.styles';
import useStyles from './FBEditorAutocomplete.styles';

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
        <FBAutocomplete
          label="common.document.types"
          options={documentTypes}
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
      )}
      {children}
    </FBEditor>
  );
};

export default FBEditorAutocomplete;
