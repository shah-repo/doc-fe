import { filter } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FB, FBAutocomplete, FBData, FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from '..';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import OverflowTooltip from '../../components/OverflowTooltip';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import FBFormState from '../FBForm/FBForm.state';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorTextField.styles';
import { getDocumentStatusOptions, getDocumentTypeOptions } from './FBEditorAutocomplete.helpers';
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
  const selectedDocumentTypes = useObserver(
    () => (formState?.newValues.get('docTypeIds') ?? formState?.getFieldValue('docTypeIds') ?? []) as string[],
  );

  const documentTypeOptions = useMemo(() => getDocumentTypeOptions(documentTypes), [documentTypes]);
  const documentStatusOptions = useMemo(() => getDocumentStatusOptions(documentTypes, selectedDocumentTypes), [documentTypes, selectedDocumentTypes]);

  const autocompleteClasses = useMemo(() => ({
    endAdornment: customClasses.endAdornment,
    inputRoot: customClasses.inputRoot,
    input: customClasses.input,
  }), [customClasses]);

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
        autoCompleteClasses={autocompleteClasses}
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
            autoCompleteClasses={autocompleteClasses}
            renderOption={(option: typeof documentTypeOptions[number]) => (
              <OverflowTooltip title={option.documentTypeName} placement="right" arrow>
                {option.documentTypeName}
              </OverflowTooltip>
            )}
            getTagLabel={(option: typeof documentTypeOptions[number]) => (
              <OverflowTooltip title={option.documentTypeName} arrow>
                {option.documentTypeName}
              </OverflowTooltip>
            )}
            multiple
          />
          <FBAutocomplete
            label="common.status"
            options={documentStatusOptions.map((option) => option.id)}
            name="documentStatuses"
            optionLabelKey="label"
            autoCompleteClasses={autocompleteClasses}
            renderOption={(option: string) => (
              <OverflowTooltip title={documentStatusOptions.find((o) => o.id === option)?.label} placement="right" arrow>
                {documentStatusOptions.find((o) => o.id === option)?.label}
              </OverflowTooltip>
            )}
            getTagLabel={(option: string) => (
              <OverflowTooltip title={documentStatusOptions.find((o) => o.id === option)?.label} arrow>
                {documentStatusOptions.find((o) => o.id === option)?.label}
              </OverflowTooltip>
            )}
            multiple
          />
        </>
      )}
      {children}
    </FBEditor>
  );
};

export default FBEditorAutocomplete;
