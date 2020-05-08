import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import FormHeaderPresenter from "./FormHeader.presenter";

interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;
  docInfo: any;
  isDisabled: boolean;
  asyncState: AsyncState;
}

const FormHeader: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  values,
  docInfo,
  isDisabled,
  asyncState,
}) => (
  <FormHeaderPresenter
    {...{
      canChangeOwnerShip,
      values,
      documentRevision,
      asyncState,
      isDisabled,
      docInfo,
    }}
  />
);

export default FormHeader;
