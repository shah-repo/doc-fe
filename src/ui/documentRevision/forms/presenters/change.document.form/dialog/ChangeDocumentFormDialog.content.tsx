import { DialogContent } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { SelectTemplateFormValues } from "../../../../../change.request/form/types";
import AutocompleteField from "../../../../../components/forms/fields/Autocomplete/Autocomplete";
import { FormContext } from "../../../../../components/forms/FormContext";


interface Props {
  options: any[];
}

const ChangedocumentFormContent: React.FunctionComponent<Props> = ({

  options,
}) => {

  const renderForm = (props: FormikProps<SelectTemplateFormValues>) => (
    <DialogContent style={{ minWidth: "500px" }}>
      <AutocompleteField
        aria-label="selectForm"
        name="select-form"
        size="sm"
        label="common.choose.template"
        autocompleteProps={{ id: "FormList-selectForm" }}
        options={options}
      />
    </DialogContent>
  );

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={{ chosenFormId: "" }}
        onSubmit={() => { return; }}
      >
        {renderForm}
      </Formik>
    </FormContext.Provider>
  );
};

export default ChangedocumentFormContent;
