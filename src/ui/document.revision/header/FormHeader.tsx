
import React from "react";
import SM from "../../../App/Shifamed/Utils/SM/SM";
import FormHeaderPresenter from "./FormHeader.presenter";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeader: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled }) => (
  <FormHeaderPresenter {...{ isCreateDocumentDisabled }} newVariant={SM.isNewLayout}/>
);

export default FormHeader;
