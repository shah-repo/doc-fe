import { useFormikContext } from "formik";
import React, { useContext } from "react";
import { FB } from "../../form.builder";

export const FormContext = React.createContext({ submitOnChange: false });

export const useFormContext = () => {
  const context = useContext(FormContext);
  const formik = useFormikContext();
  const { workspaceState, formState } = FB.useStores();
  function setFBValue() {
    const values = formik.values as any;
    switch (workspaceState?.getMode()) {
      case "design":
        formik.setFieldValue("formTemplate", {
          outputDocumentTypes: (values.outputDocumentTypes || [])
            .map((outputDoc) => ({ id: outputDoc.value }) ),
          schema: workspaceState?.getSchema(),
        });
        break;
      case "form":
      case "formDesign":
        formik.setFieldValue("formDocument", {
          id: values.formDocument?.id,
        });
        formik.setFieldValue("formInput", formState?.getValues());
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
    }
  }
  // TODO: check if this param is needed. Formik context should be available
  const submitForm = () => {
    if (context.submitOnChange) {
      if (workspaceState) {
        setFBValue();
      }
      formik.submitForm();
    }
  };

  return {
    ...context,
    submitForm,
  };
};
