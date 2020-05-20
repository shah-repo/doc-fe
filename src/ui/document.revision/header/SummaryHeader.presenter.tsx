import { Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import OwnerChangerContainer from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import DocumentListInfo from "./DocumentListInfo";
import Header from "./Header";

interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  canShowCreateVersionButton?: boolean;
}

const SummaryHeaderPresenter: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => (
  <Header>
    <DocumentListInfo documentRevision={documentRevision} />
    <Grid item={true} xs={6}>
      <Grid container={true} alignItems="flex-end" justify="flex-end">
        <ControlsContainer
          documentRevision={documentRevision}
          canShowCreateVersionButton={canShowCreateVersionButton}
          hasAccess={documentRevision.document.canAccess}
        />
        {canChangeOwnerShip && (
          <OwnerChangerContainer
            requestId={documentRevision.id}
            requestType={RequestType.Document}
          />
        )}
      </Grid>
    </Grid>
  </Header>
);

export default SummaryHeaderPresenter;
