import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { DocumentRevision, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { documentTypeActions, DocumentTypeById, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentProposedId, documentsActions } from "../../../state/ducks/documents";
import Text from "../../components/Text";
import { toDocumentRevisionFormValuesForOutput, toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import FormListDialog from "../FormListDialog/FormListDialog.presenter";
import { styles } from "./styles";

interface Props {
  documentTypeName: string;
  documentTypeId: string;
}

export const useHandleCreateDoc = () => {
  const history = useHistory();
  const [documentIdState, setDocumentId] = useState("");
  const [docRevIdState, setDocRevId] = useState("");
  const [form, setForm] = useState<DocumentRevision>();
  const fetchDocIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const fetchDocIdAsync = useAsync<DocumentProposedId>({
    onSuccess: (data) => {
      createDoc(data?.docId as string);
    }, onError: () => redirect(),
  });
  const fetchFormDocAction = useActionCreator(documentRevisionsActions.loadWithCallback);
  const fetchFormDocAsync = useAsync<DocumentRevision>({
    onSuccess: (data) => {
      const outputDocumentTypes = data?.formTemplate?.outputDocumentTypes || [];
      if (outputDocumentTypes.length === 1) {
        fetchDocIdAsync.start(fetchDocIdAction, (outputDocumentTypes[0] as any)?.id, fetchDocIdAsync);
        setForm(data);
        return;
      }
      redirect();
    }, onError: () => redirect(),
  });
  const fetchFormDoc = (documentId: string, docRevId: string) => {
    fetchFormDocAsync.start(fetchFormDocAction, docRevId, fetchFormDocAsync);
  };
  const createDoc = (docId: string) => {
    const formValues = toDocumentRevisionFormValuesForOutput(form as DocumentRevision);
    const data = toNewVersionRequestBody(formValues);
    console.log(formValues);
    console.log(data);
  };
  const redirect = () => {
    history.push(`/document_revision/${documentIdState}/output_document/${docRevIdState}`);
  };

  return (documentId: string, docRevId: string) => {
    setDocumentId(documentId);
    setDocRevId(docRevId);
    fetchFormDoc(documentId, docRevId);
  };
};

const CreateDocumentByType: React.FunctionComponent<Props> = ({
  documentTypeName,
  documentTypeId,
}) => {
  const handleCreateDocument = useHandleCreateDoc();
  // const history = useHistory();
  const dialog = useDialog();
  const classes = styles();
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const formIds = useSelector(documentTypeSelectors.formIds);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [multipleForm, toggleMultipleForm] = React.useState(false);
  const docRevId = useSelector(documentTypeSelectors.docRevTypeById);

  useEffect(() => {
    setErrorMessage(undefined);
  }, [documentTypeId]);

  const async = useAsync<DocumentTypeById>({
    onSuccess: () => {
      if (formIds.length === 1) {
        handleCreateDocument(formIds[0].document.id, docRevId);
        // history.push(`/document_revision/${formIds[0].document.id}/output_document/${docRevId}`);
        return;
      }
      if (isEmpty(formIds)) {
        setErrorMessage("missing.form.error");
        return;
      }
      toggleMultipleForm(true);
      dialog.open();
    },
    onError: (msg) => setErrorMessage(msg),
  });

  const openDocRev = () => {
    setErrorMessage(undefined);
    async.start(getDocRevByIds, documentTypeId, async);
  };

  const handleSelection = (docRevId) => {
    if (!docRevId) {
      return;
    }
    const form = formIds.find((form) => form.id === docRevId);
    const documentId = form?.document.id || "";
    handleCreateDocument(documentId, docRevId);
    // history.push(`/document_revision/${documentId}/output_document/${docRevId}`);
  };

  return (
    <>
      <Grid item={true} xs={6} style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={openDocRev}
          id="DocumentByTypeListPresenter-openDocRev"
        >
          <Text
            translation="supplier.add.new"
            values={{ name: documentTypeName }}
          />
        </Button>
      </Grid>
      {
        errorMessage && (
          <div style={{ color: "red" }} id="DocumentByTypeListPresenter-showError">
            <Text
              message={errorMessage}
              values={{ name: documentTypeName }}
            />
          </div>
        )
      }
      {
        multipleForm &&
        <FormListDialog
          dialog={dialog}
          handleSelection={handleSelection}
          formIds={formIds}
        />
      }
    </>
  );
};

export default CreateDocumentByType;
