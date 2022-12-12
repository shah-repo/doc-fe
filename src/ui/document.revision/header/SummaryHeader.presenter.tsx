import { Grid } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import HeaderLastSaved from "../../components/common/header/HeaderLastSaved";
import { generateSubtitle } from "../../components/common/header/subtitles";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";
import ControlsContainer from "../../documentRevision/PreviewControls.container";
import { getVersionNumber } from "../utils/helpers";

interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  canShowCreateVersionButton?: boolean;
  displayLastSaved: boolean;
}

const SummaryHeaderPresenter: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  canShowCreateVersionButton,
  displayLastSaved,
}) => (
  <Header
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
      displayRevision={getVersionNumber(documentRevision.id)}
    />
    <Grid item={true} xs={6}>
      <Grid container={true} alignItems="center" justify="flex-end">
        {displayLastSaved && documentRevision.updatedAt && (
          <HeaderLastSaved
            timestamp={documentRevision.updatedAt}
          />
        )}
        <ControlsContainer
          documentRevision={documentRevision}
          canShowCreateVersionButton={canShowCreateVersionButton}
          hasAccess={documentRevision.document.canAccess}
          canChangeOwnerShip={canChangeOwnerShip || false}
        />
      </Grid>
    </Grid>
  </Header>
);

export default SummaryHeaderPresenter;
