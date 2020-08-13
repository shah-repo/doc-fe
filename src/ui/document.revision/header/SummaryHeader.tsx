import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import SummaryHeaderPresenter from "./SummaryHeader.presenter";

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
  return (
    <SummaryHeaderPresenter
      {...{
        documentRevision,
        canChangeOwnerShip,
        canShowCreateVersionButton,
      }}
    />

  );
};

export default SummaryHeader;
