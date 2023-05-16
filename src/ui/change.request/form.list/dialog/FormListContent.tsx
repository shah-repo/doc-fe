import { DialogContent } from '@material-ui/core';
import { Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import AutocompleteField from '../../../components/forms/fields/Autocomplete/Autocomplete';
import { FormContext } from '../../../components/forms/FormContext';
import { DialogHandler } from '../../../hooks/useDialog';
import { Translation } from '../../../translations/types';
import { InDraftAROption, SelectTemplateFormValues, TemplateOption } from '../../form/types';
import { styles } from '../FormList.styles';
import FormListActions from './FormListActions';

interface Props {
  dialog: DialogHandler;
  templateOptions?: TemplateOption[];
  inDraftAROptions? : InDraftAROption[];
  handleTemplateSelection?: (option: TemplateOption) => void;
  handleExistingARSelection?: (option: InDraftAROption) => void;
  labelTranslation?: Translation;
}

const FormListContent: React.FunctionComponent<Props> = ({
  dialog,
  templateOptions,
  inDraftAROptions,
  handleTemplateSelection,
  handleExistingARSelection,
  labelTranslation,
}) => {
  const classes = styles();
  const [chosenOption, setChosenOption] = useState<TemplateOption | InDraftAROption>();

  const renderForm = (props: FormikProps<SelectTemplateFormValues>) => (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <AutocompleteField
        aria-label="selectForm"
        name="select-form"
        size="sm"
        label={labelTranslation ?? 'common.choose.template'}
        autocompleteProps={{ id: 'FormList-selectForm' }}
        options={templateOptions ?? inDraftAROptions ?? []}
        onClick={(option) => { setFormValues(option); }}
      />
      <FormListActions {...{ dialog, confirm }}/>
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
