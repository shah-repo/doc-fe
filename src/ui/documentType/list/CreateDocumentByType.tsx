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
import { documentVersionPath } from "../../document.revision/utils/paths";
import { toDocumentRevisionFormValuesForOutput, toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { useCreateDocumentTypeButton } from "../../hooks/docCustomization/useCustomization";
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
  const [form, setForm] = useState<DocumentRevision>();
  const fetchDocIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const fetchDocIdAsync = useAsync<DocumentProposedId>({
    onSuccess: (data) => {
      createDoc(data?.docId as string);
    }, onError: () => redirect(),
  });
  const createDocAction = useActionCreator(documentRevisionsActions.create);
  const createDocAsync = useAsync<DocumentRevision>({
    onSuccess: (documentRevision) => {
      const path = documentVersionPath(documentRevision?.id || "", documentRevision?.document?.id || "");
      history.push(path);
    }, onError: (msg) => redirect(),
  });
  const createDoc = (docId: string) => {
    const formValues = toDocumentRevisionFormValuesForOutput(form as DocumentRevision);
    const data = toNewVersionRequestBody(formValues);
    data.formDocument = { id: formValues?.formDocument?.id };
    data.document = {
      ...data.document,
      docId,
    };
    createDocAsync.start(createDocAction, data, createDocAsync);
  };
  const redirect = (selectedForm = form) => {
    history.push({
      pathname: "/document_revision/create",
      state: selectedForm,
    });
  };

  return (selectedForm: DocumentRevision) => {
    const outputDocumentTypes = selectedForm?.formTemplate?.outputDocumentTypes || [];
    if (outputDocumentTypes.length === 1 && !(outputDocumentTypes[0] as any)?.documentTypeAcronym?.startsWith("RC")) {
      fetchDocIdAsync.start(fetchDocIdAction, (outputDocumentTypes[0] as any)?.id, fetchDocIdAsync);
      setForm(selectedForm);
      return;
    }
    redirect(selectedForm);
  };
};

const CreateDocumentByType: React.FunctionComponent<Props> = ({
  documentTypeName,
  documentTypeId,
}) => {
  const handleCreateDocument = useHandleCreateDoc();
  const dialog = useDialog();
  const classes = styles();
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const formIds = useSelector(documentTypeSelectors.formIds);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [multipleForm, toggleMultipleForm] = React.useState(false);
  const [isVisible, label] = useCreateDocumentTypeButton(documentTypeId);

  useEffect(() => {
    setErrorMessage(undefined);
  }, [documentTypeId]);

  const async = useAsync<DocumentTypeById>({
    onSuccess: () => {
      if (formIds.length === 1) {
        handleCreateDocument(formIds[0] as DocumentRevision);
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
    const selectedForm = formIds.find((form) => form.id === docRevId);
    handleCreateDocument(selectedForm as DocumentRevision);
  };

  if (!isVisible) {
    return null;
  }

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
            message={label}
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
