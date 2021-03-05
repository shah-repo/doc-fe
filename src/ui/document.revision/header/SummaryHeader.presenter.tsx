import { Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import OwnerChangerContainer from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";
import ControlsContainer from "../../documentRevision/PreviewControls.container";

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
    <HeaderInfo
      revisionStage={documentRevision.revisionStage}
      groupOptions={documentRevision.document.documentType.groupOptions}
      isInlineApproval={
        isFormWithInlineApproval(documentRevision.formDocument?.formTemplate?.schema)
      }
      status={documentRevision.status}
      id={documentRevision.document.docId}
      name={documentRevision.name}
      documentTypeId={documentRevision?.document?.documentType.id}
      revisionChangeType={documentRevision?.revisionChangeType}
      subRevision={documentRevision?.subRevision}
      displayStatus={documentRevision.displayStatus}
    />
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
