import { Grid } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { FB } from "..";
import { LINE_TYPES } from "../../../state/ducks/attachments/constants";
import { authSelectors } from "../../../state/ducks/auth";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { FormContext } from "../../components/forms/FormContext";
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
  const { workspaceState } = FB.useStores();
  const { id: docRevId, mode, schema } = workspaceState || {};
  const documentRevisionFromState = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, docRevId || "")
  );
  documentRevision = documentRevision || documentRevisionFromState;
  const isOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
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
  const getAttachMentLabel = schema?.filter((o) => o.type === "attachments");
  const schemaLabel = getAttachMentLabel ? getAttachMentLabel[0].label as string : "";
  const onSubmit = () => void 0;
  return (
    <Grid>
      { (mode === "preview" || mode === "design")  &&
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik
          initialValues={{ attachments: documentRevision?.attachments }}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          <Attachment
            isAttachmentEmpty={documentRevision?.attachments?.length < 1}
            docRevId = {documentRevision.id}
            containsRedline = {containsRedline()}
            label = {schemaLabel}
            docRevStatus={documentRevision.status}/>
        </Formik>
      </FormContext.Provider>
      }

      {mode === "form"  && <AttachmentsField
        isDisabled={isDisabledInput}
        labeld = {schemaLabel}
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
