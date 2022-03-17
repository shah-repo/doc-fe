import { Collapse, Grid } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { SM } from "../../../..";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import Header from "../../../../../ui/components/common/header/Header";
import HeaderInfo from "../../../../../ui/components/common/header/HeaderInfo";
import { generateSubtitle } from "../../../../../ui/components/common/header/subtitles";
import { isFormWithInlineApproval } from "../../../../../ui/documentRevision/helpers/records";
import ControlsContainer from "../../../../Enlil/Features/DocumentRevision/PreviewControls.container";

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
  const { _documentRevisionFormState } = SM.useStores();
  return (
    <Observer>
      {() => (
        <>
          <Collapse in={!_documentRevisionFormState?.isHeaderHidden}>
            <Header
              displayStatus={documentRevision.displayStatus}
              status={documentRevision.status}
            >
              <HeaderInfo
                revisionStage={documentRevision.revisionStage}
                groupOptions={
                  documentRevision.document.documentType.groupOptions
                }
                isInlineApproval={isFormWithInlineApproval(
                  documentRevision.formDocument?.formTemplate?.schema
                )}
                status={documentRevision.status}
                displayRevision={documentRevision?.displayRevision}
                id={documentRevision.document.docId}
                name={documentRevision.name}
                documentTypeId={documentRevision?.document?.documentType.id}
                revisionChangeType={documentRevision?.revisionChangeType}
                subRevision={documentRevision?.subRevision}
                displayStatus={documentRevision.displayStatus}
                subtitle={generateSubtitle(documentRevision)}
                newVarient
              />

              <Grid item={true} xs={6} style={{ paddingRight: "15px" }}>
                <Grid container={true} alignItems="center" justify="flex-end">
                  <ControlsContainer
                    documentRevision={documentRevision}
                    canShowCreateVersionButton={canShowCreateVersionButton}
                    hasAccess={documentRevision.document.canAccess}
                    canChangeOwnerShip={canChangeOwnerShip}
                  />
                </Grid>
              </Grid>
            </Header>
          </Collapse>
        </>
      )}
    </Observer>
  );
};

export default NewSummaryHeaderPresenter;
