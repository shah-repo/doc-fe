import React from "react";
import { SM } from "../../../App";
import NewFormHeaderPresenter from "../../../App/Shifamed/Components/forms/header/FormHeader.presenter";
import FormHeaderPresenter from "./FormHeader.presenter";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeader: React.FunctionComponent<Props> = ({
  isCreateDocumentDisabled,
}) =>
  SM.isNewLayout ? (
    <NewFormHeaderPresenter {...{ isCreateDocumentDisabled }} />
  ) : (
    <FormHeaderPresenter {...{ isCreateDocumentDisabled }} />
  );

export default FormHeader;
