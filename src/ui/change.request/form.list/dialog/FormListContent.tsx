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
}

const FormListContent: React.FunctionComponent<Props> = ({
  dialog,
  templateOptions,
}) => {
  const classes = styles();
  const [chosenTypeId, setchosenTypeId] = useState<string>("");
  const [ chosenFormId, setChosenFormId ] = useState<string>("");

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
      <FormListActions {...{ dialog, chosenFormId, chosenTypeId }}/>
    </DialogContent>
  );

  const setFormValues = (option) => {
    setchosenTypeId(option.docTypeId);
    setChosenFormId(option.value);
  };

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={{ chosenFormId: "" }}
        onSubmit={setFormValues}
      >
        {renderForm}
      </Formik>
    </FormContext.Provider>
  );
};

export default FormListContent;
