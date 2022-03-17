import React from "react";
import NewFormHeaderPresenter from "../../../App/Shifamed/Components/forms/header/FormHeader.presenter";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeader: React.FunctionComponent<Props> = ({
  isCreateDocumentDisabled,
}) =>
  <NewFormHeaderPresenter {...{ isCreateDocumentDisabled }} newVarient />;


export default FormHeader;
