import { Grid } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { FB } from "..";
import { LINE_TYPES } from "../../../state/ducks/attachments/constants";
import { authSelectors } from "../../../state/ducks/auth";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import AttachmentsField from "../../document.revision/form/attachments";
import Attachment from "../../document.revision/summary/attachment";
import { isOperator } from "../../documentRevision/DocumentRevisionDisplay.container";
import { FBAttachmentProps } from "./FBAttachment.types";

const FBAttachment: React.FunctionComponent<FBAttachmentProps> = ({
  label,
  gutter = true,
  bookmarked = true,
  showErrorMsg = false,
  omitFinalValidation = true,
  stepIndex,
  children,
  loading,
  name,
  documentRevision,
  values,
  isNewVersion,
  ...props
}) => {
  const isCurrentUserOperator = React.useContext(isOperator);
  const email = useSelector(authSelectors.currentUserEmail);
  const isOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const { workspaceState } = FB.useStores();
  const { id: docRevId, mode } = workspaceState || {};
  const documentRevisionFromState = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, docRevId || "")
  );
  documentRevision = documentRevision || documentRevisionFromState;
  const isAttachmentEmpty = (documentRevision?.attachments?.length === 0);
  const documentTypeId = documentRevision.document?.documentType?.id || "";
  const isDisabledInput = documentRevision.id !== undefined && isCurrentUserOperator && !isOwner;

  const containsRedline = (): boolean => {
    for (const attachment of documentRevision?.attachments) {
      if (attachment.lineType === LINE_TYPES.RED_LINE) {
        return true;
      }
    }
    return false;
  };

  return (
    <Grid>
      { mode === "preview" && !isOwner && <Attachment
        isAttachmentEmpty={documentRevision?.attachments?.length < 1}
        docRevId = {documentRevision.id}
        containsRedline = {containsRedline()}
        docRevStatus={documentRevision.status}/>}

      {mode === "form" && isOwner  && <AttachmentsField
        isDisabled={isDisabledInput}
        isNewVersion={false}
        docRevId={documentRevision.id}
        isAttachmentEmpty={isAttachmentEmpty}
        containsRedline={false}
        docRevStatus={documentRevision.status}
        documentRevision={documentRevision}
        documentTypeId={documentTypeId || ""} />}
    </Grid>
  );
};

export default FBAttachment;
