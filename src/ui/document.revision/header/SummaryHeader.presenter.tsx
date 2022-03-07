import { Grid } from "@material-ui/core";
import React from "react";
import { SM } from "../../../App";
import FormOwnerChangerContainer from "../../../App/Shifamed/Components/forms/presenters/change.owner/container";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import HeaderMenu from "../../components/common/header/Menu";
import { generateSubtitle } from "../../components/common/header/subtitles";
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
  <Header displayStatus={documentRevision.displayStatus} status={documentRevision.status}>
    <HeaderInfo
      revisionStage={documentRevision.revisionStage}
      groupOptions={documentRevision.document.documentType.groupOptions}
      isInlineApproval={
        isFormWithInlineApproval(documentRevision.formDocument?.formTemplate?.schema)
      }
      status={documentRevision.status}
      group={documentRevision?.document?.documentType?.group}
      displayRevision={documentRevision?.displayRevision}
      id={documentRevision.document.docId}
      name={documentRevision.name}
      documentTypeId={documentRevision?.document?.documentType.id}
      revisionChangeType={documentRevision?.revisionChangeType}
      subRevision={documentRevision?.subRevision}
      displayStatus={documentRevision.displayStatus}
      subtitle={generateSubtitle(documentRevision)}
    />

    <Grid item={true} xs={6}>
      <Grid container={true} alignItems="flex-end" justify="flex-end">
        <ControlsContainer
          documentRevision={documentRevision}
          canShowCreateVersionButton={canShowCreateVersionButton}
          hasAccess={documentRevision.document.canAccess}
        />
        {SM.isNewLayout ? <HeaderMenu>
          {canChangeOwnerShip && (
            <FormOwnerChangerContainer
              requestId={documentRevision.id}
              requestType={RequestType.Document}
            />
          )} </HeaderMenu> :  canChangeOwnerShip && (
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
