import { Grid } from "@material-ui/core";
import React from "react";
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

  const groupOptions = documentRevision.document?.documentType?.groupOptions;
  const isExportable = !documentRevision.renderHTML && checkIsDocumentExportable(groupOptions);
  return (<NewHeader
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
  ); };

export default NewSummaryHeaderPresenter;
