import { Box } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { DocumentRevision, documentRevisionsActions, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import { documentPreviewPath } from "../../../document.revision/utils/paths";
import { toNewVersionRequestBody } from "../../../documentRevision/forms/transform";
import { DocumentRevisionFormValues } from "../../../documentRevision/forms/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import FBStore from "../../stores/ui/FBStore";
import { FBPurchaseOrderFormProps } from "../FBPurchaseOrder.types";
import FBPurchaseOrderLotForm from "./FBPurchaseOrderReceiveForm";

const FBPurchaseOrderReceiveFormContainer: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
  onSubmit,
  name,
  ...props
}) => {
  const history = useHistory();
  const releaseAction = useActionCreator(documentRevisionsActions.createAndRelease);
  const releaseAsync = useAsync<DocumentRevision>({
    onSuccess: (docRev) => {
      const path = docRev && documentPreviewPath(docRev.id, docRev.document.id);
      history.push(path);
      props.closeDialog();
    },
  });
  const handleSubmit = (values) => {
    const item = values[`${name}-formValues`];
    onSubmit(item);

    const { password } = values;
    const { document } = FBStore;
    const releasedDocumentRevision = toNewVersionRequestBody({
      ...document,
      formInput: { ...FBStore.getValues() },
      revisionChangeType: RevisionChangeType.NextRevision,
    } as unknown as DocumentRevisionFormValues);
    const body = { releasedDocumentRevision, releaseDto: [] };
    releaseAsync.start(releaseAction, document.id, body, password, releaseAsync);
  };
  const validateForm = (values) => {
    const item = values[`${name}-formValues`] || {};
    const required = "form.builder.required";
    const errors: any = {};

    !item.received && (errors.received = required);

    return errors;
  };
  return (
    <>
      <Box marginBottom="10px">
        <FormProgress asyncState={releaseAsync.asyncState} />
        <FormMessage asyncState={releaseAsync.asyncState} />
      </Box>
      <FBPurchaseOrderLotForm {...props} onSubmit={handleSubmit} validateForm={validateForm} name={name} />
    </>
  );
};

export default FBPurchaseOrderReceiveFormContainer;
