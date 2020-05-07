import { useFormikContext } from "formik";
import { get } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Document, DocumentRevision, documentRevisionsActions, documentRevisionsSelectors, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import { getIsLastVersionObsolete } from "../../documentRevision/helpers";
import { FBValidate } from "../../form.builder/defaults/validator";
import FormHeaderPresenter from "./FormHeader.presenter";

interface Props {
  documentRevision: DocumentRevision;
  handleCancelDraft: () => void;
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;
  onUpgradeClick: () => void;
  docInfo: any;
  isDisabled: boolean;
  asyncState: AsyncState;
}

const FormHeader: React.FunctionComponent<Props> = ({
  documentRevision,
  handleCancelDraft,
  canChangeOwnerShip,
  values,
  onUpgradeClick,
  docInfo,
  isDisabled,
  asyncState,
}) => {
  const formik = useFormikContext();
  const dispatch = useDispatch();
  const formDocumentStatus = get(documentRevision, "formDocument.status", "");
  const documentStatus = documentRevision && documentRevision.status;
  const canShowCancelButton = documentStatus === DocumentRevisionStatus.Draft && documentRevision.version > 1;
  const isFormStatusDeprecated = formDocumentStatus === DocumentRevisionStatus.Deprecated;
  const formDocumentId = documentRevision && (documentRevision.formDocument?.document?.id || "");
  const formDocuments: Document = useSelector((state: ApplicationState) => documentRevisionsSelectors.getDocument(state, formDocumentId));

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);

  const isLastVersionObsolete = formDocuments && getIsLastVersionObsolete(formDocuments);
  const isDocumentStatusDraftOrPending =
    documentStatus === (DocumentRevisionStatus.Draft || DocumentRevisionStatus.PendingChange);
  const onFormClick = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    formik.submitForm();
    FBValidate();
  };

  return (
    <FormHeaderPresenter
      {...{
        canShowCancelButton,
        handleCancelDraft,
        canChangeOwnerShip,
        values,
        isFormStatusDeprecated,
        isDocumentStatusDraftOrPending,
        isLastVersionObsolete,
        documentRevision,
        asyncState,
        isDisabled,
        onFormClick,
        docInfo,
        onUpgradeClick,
      }}
    />
  ); };

export default FormHeader;
