import React, { useContext } from "react";

export const FormContext = React.createContext({ disableFieldSubmit: false });

export const useFormContext = () => useContext(FormContext);
