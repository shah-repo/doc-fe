import React from "react";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import SummaryHeaderPresenter from "./SummaryHeader.presenter";

interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  canShowCreateVersionButton?: boolean;
  displayLastEdit?: boolean;
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
  const displayLastSaved = (
    documentRevision.status === DocumentRevisionStatus.Draft
    || documentRevision.status === DocumentRevisionStatus.PendingChange
  );
  return (
    <SummaryHeaderPresenter
      {...{
        documentRevision,
        canChangeOwnerShip,
        canShowCreateVersionButton,
        displayLastSaved,
      }}
    />

  );
};

export default SummaryHeader;
