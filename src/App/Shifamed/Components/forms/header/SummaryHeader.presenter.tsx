import { Collapse, Grid } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { useLocation } from "react-router-dom";
import { SM } from "../../../..";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { generateSubtitle } from "../../../../../ui/components/common/header/subtitles";
import { RequestType } from "../../../../../ui/components/common/owner.changer/helpers/types";
import { checkIsDocumentExportable } from "../../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { isFormWithInlineApproval } from "../../../../../ui/documentRevision/helpers/records";
import ControlsContainer from "../../../../Enlil/Features/DocumentRevision/PreviewControls.container";
import FormOwnerChangerContainer from "../presenters/change.owner/container";
import ExportToEmail from "../presenters/ExportToEmail";
import NewHeader from "./Header";
import NewHeaderInfo from "./HeaderInfo";
import HeaderMenu from "./Menu";


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
  // console.log("current location:: debug", location);
  const { _documentRevisionFormState } = SM.useStores();
  const groupOptions = documentRevision.document?.documentType?.groupOptions;
  const isExportable = !documentRevision.renderHTML && checkIsDocumentExportable(groupOptions);
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
                />
                {
                  <HeaderMenu>
                    {canChangeOwnerShip && (
                      <FormOwnerChangerContainer
                        requestId={documentRevision.id}
                        requestType={RequestType.Document}
                      />
                    )}
                    {isExportable && <ExportToEmail
                      revisionId={documentRevision.id}
                      canAccess={documentRevision.document.canAccess}
                    />}
                  </HeaderMenu>
                }
              </Grid>
            </Grid>
          </NewHeader>
        </Collapse></>
      )}</Observer>
  ); };

export default NewSummaryHeaderPresenter;
