import React from "react";
import FormHeaderPresenter from "./FormHeader.presenter";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeader: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled }) => (
  <FormHeaderPresenter {...{ isCreateDocumentDisabled }}/>
);

export default FormHeader;
