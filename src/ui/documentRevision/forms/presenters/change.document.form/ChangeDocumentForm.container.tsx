import React from "react";
import useDialog from "../../../../hooks/useDialog";
import { checkIsDocumentForm } from "../../../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionReleased } from "../../../helpers/documentRevisionStatus";
import ChangeDocumentFormPresenter from "./ChangeDocumentForm.presenter";

interface Props {
  documentRevision: any;
}

const ChangeDocumentFormContainer: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const dialog = useDialog();

  const documentTypeId = documentRevision.document?.documentType?.id || "";
  const isStatusReleased = isDocumentRevisionReleased(documentRevision.status);
  const isStatusInDraft = isDocumentRevisionInDraft(documentRevision.status);
  const isForm = checkIsDocumentForm(documentRevision.document?.documentType?.groupOptions);
  const showFormChange = (!isForm && (isStatusInDraft || isStatusReleased));

  if (!showFormChange) {
    return null;
  }
  return (
    <ChangeDocumentFormPresenter {...{ dialog, documentTypeId }}/>
  );
};

export default ChangeDocumentFormContainer;
