import { Collapse, Grid } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { SM } from "../../../App";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
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
}) => {
  const { _documentRevisionFormState } = SM.useStores();
  const newVarient = SM.isNewLayout;

  const headerRenderer = () => <Header
    displayStatus={documentRevision.displayStatus}
    status={documentRevision.status}
  >
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
      subtitle={generateSubtitle(documentRevision)}
      newVarient={newVarient}
      displayRevision={documentRevision.displayRevision}
    />
    <Grid item={true} xs={6}>
      <Grid container={true} alignItems="flex-end" justify="flex-end">
        <ControlsContainer
          documentRevision={documentRevision}
          canShowCreateVersionButton={canShowCreateVersionButton}
          hasAccess={documentRevision.document.canAccess}
          newVarient={newVarient}
        />
        {canChangeOwnerShip && (
          <OwnerChangerContainer
            requestId={documentRevision.id}
            requestType={RequestType.Document}
            renderAsButton={true}
            newVariant={newVarient}
          />
        )}
      </Grid>
    </Grid>
  </Header>;

  return (<>
    {newVarient ?
      <Observer>
        {() => (
          <Collapse in={!_documentRevisionFormState?.isHeaderHidden}>
            {headerRenderer()}
          </Collapse>
        )}
      </Observer> :
      headerRenderer()}
  </>
  );
};

export default SummaryHeaderPresenter;
