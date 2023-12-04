import { DialogContent } from '@material-ui/core';
import { Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import { FormContext } from '../../../components/forms/FormContext';
import AutocompleteField from '../../../components/forms/fields/Autocomplete/Autocomplete';
import { DialogHandler } from '../../../hooks/useDialog';
import { Translation } from '../../../translations/types';
import { InDraftAROption, SelectTemplateFormValues, TemplateOption } from '../../form/types';
import { styles } from '../FormList.styles';
import FormListActions from './FormListActions';

interface Props {
  dialog: DialogHandler
  templateOptions?: TemplateOption[]
  inDraftAROptions?: InDraftAROption[]
  handleTemplateSelection?: (option: TemplateOption) => void
  handleExistingARSelection?: (option: InDraftAROption) => void
  labelTranslation?: Translation
  isLoading?: boolean
}

const FormListContent: React.FunctionComponent<Props> = ({
  dialog,
  templateOptions,
  inDraftAROptions,
  handleTemplateSelection,
  handleExistingARSelection,
  labelTranslation,
  isLoading,
}) => {
  const classes = styles();
  const [chosenOption, setChosenOption] = useState<TemplateOption | InDraftAROption>();
  const hasOptions
    = (templateOptions !== undefined && templateOptions?.length > 0)
      || (inDraftAROptions !== undefined && inDraftAROptions?.length > 0);

  const renderForm = (props: FormikProps<SelectTemplateFormValues>) => (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <AutocompleteField
        aria-label="selectForm"
        name="select-form"
        size="sm"
        label={labelTranslation ?? 'common.choose.template'}
        autocompleteProps={{
          id: 'FormList-selectForm',
          isLoading,
        }}
        options={templateOptions ?? inDraftAROptions ?? []}
        onClick={(option) => { setFormValues(option); }}
        isDisabled={!hasOptions || isLoading}
      />
      <FormListActions {...{ dialog, confirm }} />
    </DialogContent>
  );

  const confirm = () => {
    if (handleTemplateSelection) {
      handleTemplateSelection(chosenOption as TemplateOption);
    }

    if (handleExistingARSelection) {
      handleExistingARSelection(chosenOption as InDraftAROption);
    }
  };

  const setFormValues = (option) => {
    setChosenOption(option);
  };

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={{ chosenOption: '' }}
        onSubmit={setFormValues}
      >
        {renderForm}
      </Formik>
    </FormContext.Provider>
  );
};

export default FormListContent;
