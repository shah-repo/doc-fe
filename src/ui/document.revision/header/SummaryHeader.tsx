import React from "react";
import NewSummaryHeaderPresenter from "../../../App/Shifamed/Components/forms/header/SummaryHeader.presenter";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  canShowCreateVersionButton?: boolean;
}
export interface FormHeaderSummaryContext {
  documentRevisionSummary: DocumentRevision;
}
export let FormHeaderSummaryContext = React.createContext<FormHeaderSummaryContext | undefined>(undefined);

const SummaryHeader: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => {
  FormHeaderSummaryContext = React.createContext<FormHeaderSummaryContext | undefined>({
    documentRevisionSummary: documentRevision,
  });
  return <NewSummaryHeaderPresenter
    {...{
      documentRevision,
      canChangeOwnerShip,
      canShowCreateVersionButton,
    }}
  />;
};

export default SummaryHeader;
