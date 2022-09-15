import { DialogContent } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React, { useState } from "react";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { FormContext } from "../../../components/forms/FormContext";
import { DialogHandler } from "../../../hooks/useDialog";
import { SelectTemplateFormValues, TemplateOption } from "../../form/types";
import { styles } from "../FormList.styles";
import FormListActions from "./FormListActions";

interface Props {
  dialog: DialogHandler;
  templateOptions: TemplateOption[];
  handleTemplateSelection: (option: TemplateOption) => void;
}

const FormListContent: React.FunctionComponent<Props> = ({
  dialog,
  templateOptions,
  handleTemplateSelection,
}) => {
  const classes = styles();
  const [chosenOption, setChosenOption] = useState<TemplateOption>();

  const renderForm = (props: FormikProps<SelectTemplateFormValues>) => (
    <DialogContent classes={{ root: classes.dialogContent }}>
      <AutocompleteField
        aria-label="selectForm"
        name="select-form"
        size="sm"
        label="common.choose.template"
        autocompleteProps={{ id: "FormList-selectForm" }}
        options={templateOptions}
        onClick={(option) => { setFormValues(option); }}
      />
      <FormListActions {...{ dialog, createChangeRequest }}/>
    </DialogContent>
  );

  const createChangeRequest = () => {
    handleTemplateSelection(chosenOption as TemplateOption);
  };

  const setFormValues = (option) => {
    setChosenOption(option);
  };

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={{ chosenOption: "" }}
        onSubmit={setFormValues}
      >
        {renderForm}
      </Formik>
    </FormContext.Provider>
  );
};

export default FormListContent;
