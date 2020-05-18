import React, { useContext } from "react";

export const FormContext = React.createContext({ submitOnChange: false });

type FormikSubmit = (() => Promise<void>) & (() => Promise<any>);

export const useFormContext = () => {
  const context = useContext(FormContext);
  const submitForm = (formikSubmit: FormikSubmit) => {
    if (context.submitOnChange) {
      formikSubmit();
    }
  };

  return {
    ...context,
    submitForm,
  };
};
