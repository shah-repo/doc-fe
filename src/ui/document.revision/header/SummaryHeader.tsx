import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import SummaryHeaderPresenter from "./SummaryHeader.presenter";

interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  canShowCreateVersionButton?: boolean;
}

const SummaryHeader: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => (
  <SummaryHeaderPresenter
    {...{
      documentRevision,
      canChangeOwnerShip,
      canShowCreateVersionButton,
    }}
  />

);

export default SummaryHeader;
