import { Collapse, Grid } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { useLocation } from "react-router-dom";
import { SM } from "../../../..";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { generateSubtitle } from "../../../../../ui/components/common/header/subtitles";
import { isFormWithInlineApproval } from "../../../../../ui/documentRevision/helpers/records";
import ControlsContainer from "../../../../Enlil/Features/DocumentRevision/PreviewControls.container";
import NewHeader from "./Header";
import NewHeaderInfo from "./HeaderInfo";


interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  canShowCreateVersionButton?: boolean;
}

const NewSummaryHeaderPresenter: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => {
  const location = useLocation();
  const { _documentRevisionFormState } = SM.useStores();
  return (
    <Observer>
      {() =>  (
        <> <Collapse in={!_documentRevisionFormState?.isHeaderHidden}>
          <NewHeader
            displayStatus={documentRevision.displayStatus}
            status={documentRevision.status}
          >
            <NewHeaderInfo
              revisionStage={documentRevision.revisionStage}
              groupOptions={documentRevision.document.documentType.groupOptions}
              isInlineApproval={isFormWithInlineApproval(
        documentRevision.formDocument?.formTemplate?.schema
              )}
              status={documentRevision.status}
              group={location.state}
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
              <Grid container={true} alignItems="center" justify="flex-end">
                <ControlsContainer
                  documentRevision={documentRevision}
                  canShowCreateVersionButton={canShowCreateVersionButton}
                  hasAccess={documentRevision.document.canAccess}
                  canChangeOwnerShip={canChangeOwnerShip}
                />
              </Grid>
            </Grid>
          </NewHeader>
        </Collapse></>
      )}</Observer>
  ); };

export default NewSummaryHeaderPresenter;
