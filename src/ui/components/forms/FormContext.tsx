import { useFormikContext } from "formik";
import React, { useContext } from "react";
import { FB } from "../../form.builder";

export const FormContext = React.createContext({ submitOnChange: false });

type FormikSubmit = (() => Promise<void>) & (() => Promise<any>);

export const useFormContext = () => {
  const context = useContext(FormContext);
  const formik = useFormikContext();
  const { workspaceState, formState } = FB.useStores();
  function setFBValue() {
    const values = formik.values as any;
    switch (workspaceState?.getMode()) {
      case "design":
        formik.setValues({
          ...values,
          formTemplate: {
            outputDocumentTypes: (values.outputDocumentTypes || [])
              .map((outputDoc) => ({ id: outputDoc.value }) ),
            schema: workspaceState?.getSchema(),
          },
        });
        break;
      case "form":
        formik.setValues({
          ...values,
          formDocument: {
            id: values.formDocument?.id,
          },
          formInput: formState?.getValues(),
        });
        break;
      default:
        formik.setValues({
          ...values,
          formTemplate: undefined,
        });
    }
  }
  const submitForm = (formikSubmit: FormikSubmit) => {
    if (context.submitOnChange) {
      if (workspaceState) {
        setFBValue();
      }
      formikSubmit();
    }
  };

  return {
    ...context,
    submitForm,
  };
};
