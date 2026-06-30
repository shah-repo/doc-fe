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
import { getChangeRequestStatusOptions, getDocumentStatusOptionLabel, getDocumentStatusOptions, getDocumentTypeOptions } from './FBEditorAutocomplete.helpers';
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
  const changeRequestStatusOptions = useMemo(() => getChangeRequestStatusOptions(), []);

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
            options={documentStatusOptions.map((option) => ({ id: option.id, label: option.id }))}
            name="documentStatuses"
            optionLabelKey="label"
            optionValueKey="id"
            autoCompleteClasses={autocompleteClasses}
            renderOption={(option: typeof documentStatusOptions[number]) => (
              <OverflowTooltip title={getDocumentStatusOptionLabel(option, documentStatusOptions)} placement="right" arrow>
                {getDocumentStatusOptionLabel(option, documentStatusOptions)}
              </OverflowTooltip>
            )}
            getTagLabel={(option: typeof documentStatusOptions[number]) => (
              <OverflowTooltip title={getDocumentStatusOptionLabel(option, documentStatusOptions)} arrow>
                {getDocumentStatusOptionLabel(option, documentStatusOptions)}
              </OverflowTooltip>
            )}
            multiple
          />
        </>
      )}
      {optionId === FBAutocompleteAsyncOption.changeRequests && (
        <FBAutocomplete
          label="common.status"
          options={changeRequestStatusOptions}
          name="changeRequestStatuses"
          optionLabelKey="label"
          optionValueKey="id"
          autoCompleteClasses={autocompleteClasses}
          renderOption={(option: typeof changeRequestStatusOptions[number]) => (
            <OverflowTooltip title={option.label} placement="right" arrow>
              {option.label}
            </OverflowTooltip>
          )}
          getTagLabel={(option: typeof changeRequestStatusOptions[number]) => (
            <OverflowTooltip title={option.label} arrow>
              {option.label}
            </OverflowTooltip>
          )}
          multiple
        />
      )}
      {children}
    </FBEditor>
  );
};

export default FBEditorAutocomplete;
