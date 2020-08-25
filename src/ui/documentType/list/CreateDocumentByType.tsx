import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Formik, FormikProps } from "formik";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { DocumentRevision, documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentType, documentTypeActions, DocumentTypeById, documentTypeSelectors, DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentProposedId, documentsActions } from "../../../state/ducks/documents";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { FormContext } from "../../components/forms/FormContext";
import Text from "../../components/Text";
import { documentVersionPath } from "../../document.revision/utils/paths";
import { toDocumentRevisionFormValuesForOutput, toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { useCreateDocumentByTypeButton } from "../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import DocumentTypeDialog from "../dialogs/DocumentTypeDialog.presenter";
import FormListDialog from "../dialogs/FormListDialog/FormListDialog.presenter";
import { MultipleFormTemplateDialog } from "../dialogs/MultipleFormTemplateDialog";
import { filterSecurityGroupsForQms } from "./helpers";
import { styles } from "./styles";

interface Props {
  isByCategory: boolean;
  labelName: string;
  documentTypeId?: string;
  categoryName?: string;
}

let selectedTypeLabel = "";
let selectedDocumentTypeId: string;

export const useHandleCreateDoc = () => {
  const selectedDocumentType = useSelector(documentTypeSelectors.byId)[selectedDocumentTypeId];
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
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
    const formValues = toDocumentRevisionFormValuesForOutput(form as DocumentRevision, selectedDocumentType);
    const outputDocumentTypes = form?.formTemplate?.outputDocumentTypes || [];
    const isQms = (outputDocumentTypes[0] as unknown as DocumentType)?.isQms;
    formValues.securityGroups = filterSecurityGroupsForQms(isQms, groupOptions);

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
    if (selectedDocumentTypeId) {
      fetchDocIdAsync.start(fetchDocIdAction, selectedDocumentTypeId, fetchDocIdAsync);
      setForm(selectedForm);
      return;
    }
    redirect(selectedForm);
  };
};

const CreateDocumentByType: React.FunctionComponent<Props> = ({
  labelName,
  documentTypeId,
  categoryName,
  isByCategory,
}) => {
  const handleCreateDocument = useHandleCreateDoc();
  const classes = styles();

  const formDialog = useDialog();
  const docTypeDialog = useDialog();
  const multipleFormDialog = useDialog();

  const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);

  const formIds = useSelector(documentTypeSelectors.formIds);
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypesByCategory);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [multipleForm, toggleMultipleForm] = React.useState(false);
  const [docTypeForm, toggleDocTypeForm] = React.useState(false);

  const [isVisible, label] = useCreateDocumentByTypeButton(documentTypeId);
  const buttonLabel = isByCategory ? labelName : label;
  const isRecord = categoryName?.toUpperCase() === DOC_TYPE_GROUP_OPTION.RECORD;

  if (!isByCategory && documentTypeId) {
    selectedDocumentTypeId = documentTypeId;
  }

  useEffect(() => {
    setErrorMessage(undefined);
  }, [documentTypeId]);

  const idAsync = useAsync<DocumentTypeById>({
    onSuccess: () => {
      toggleDocTypeForm(false);
      if (isRecord && formIds.length !== 1) {
        return;
      }
      if (formIds.length === 1) {
        handleCreateDocument(formIds[0] as DocumentRevision);
        return;
      }
      if (isEmpty(formIds)) {
        setErrorMessage("missing.form.error");
        return;
      }
      toggleMultipleForm(true);
      formDialog.open();
    },
    onError: (msg) => setErrorMessage(msg),
  });

  const categoryAsync = useAsync<DocumentType[]>({
    onSuccess: () => {
      if (isRecord) {
        multipleFormDialog.open();
        return;
      }
      if (documentTypes.length === 1 && !isRecord) {
        selectedDocumentTypeId = documentTypes[0].id;
        idAsync.start(getDocRevByIds, documentTypes[0].id, idAsync);
        return;
      }
      if (isEmpty(documentTypes)) {
        setErrorMessage("missing.type.error");
        return;
      }
      toggleDocTypeForm(true);
      docTypeDialog.open();
    },
    onError: (msg) => setErrorMessage(msg),
  });

  const handleAddButtonClick = () => {
    setErrorMessage(undefined);
    if (isByCategory) {
      categoryAsync.start(getDocTypesByCategory, { category: categoryName }, categoryAsync);
      return;
    }
    idAsync.start(getDocRevByIds, documentTypeId, idAsync);
    return;
  };

  const handleFormSelection = (docRevId) => {
    if (!docRevId) {
      return;
    }
    const selectedForm = formIds.find((form) => form.id === docRevId);
    handleCreateDocument(selectedForm as DocumentRevision);
  };

  const handleDocTypeSelection = (docTypeId) => {
    if (!docTypeId) {
      return;
    }
    selectedDocumentTypeId = docTypeId;
    selectedTypeLabel = documentTypes.find((type) => type.id === docTypeId)?.documentTypeName || "";
    idAsync.start(getDocRevByIds, docTypeId, idAsync);
  };

  const handleMultipleFormTypeSelection = (id) => {
    if (!id) {
      return;
    }
    idAsync.start(getDocRevByIds, id, idAsync);
  };

  const handleMultipleFormTemplateSelection = (id) => {
    if (!id) {
      return;
    }
    const selectedForm = formIds.find((form) => form.id === id);
    handleCreateDocument(selectedForm as DocumentRevision);
  };

  const renderDocumentTypeDialog = (props: FormikProps<any>) => (
    <DocumentTypeDialog
      {...props}
      dialog={docTypeDialog}
      handleSelection={handleDocTypeSelection}
      documentTypes={documentTypes}
    />
  );

  const renderFormListDialog = (props: FormikProps<any>) => (
    <FormListDialog
      {...props}
      dialog={formDialog}
      handleSelection={handleFormSelection}
      formIds={formIds}
    />
  );

  const renderMultipleFormTemplateDialog = (props: FormikProps<any>) => (
    <MultipleFormTemplateDialog
      {...props}
      dialog={multipleFormDialog}
      handleSelection={handleMultipleFormTypeSelection}
      handleTemplateSelection={handleMultipleFormTemplateSelection}
      documentTypes={documentTypes}
      formIds={formIds}
    />
  );

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
          onClick={handleAddButtonClick}
          id="DocumentByTypeListPresenter-openDocRev"
        >
          <Text
            message={buttonLabel}
            values={{ name: labelName }}
          />
        </Button>
      </Grid>
      {
        errorMessage && (
          <div style={{ color: "red" }} id="DocumentByTypeListPresenter-showError">
            <Text
              message={errorMessage}
              values={{ name: isByCategory ? selectedTypeLabel : labelName }}
            />
          </div>
        )
      }
      {
        isRecord && (
          <FormContext.Provider value={{ submitOnChange: false }}>
            <Formik initialValues={{}} onSubmit={handleMultipleFormTypeSelection}>
              {renderMultipleFormTemplateDialog}
            </Formik>
          </FormContext.Provider>
        )
      }
      {
        docTypeForm && !isRecord && (
          <FormContext.Provider value={{ submitOnChange: false }}>
            <Formik initialValues={{}} onSubmit={handleDocTypeSelection}>
              {renderDocumentTypeDialog}
            </Formik>
          </FormContext.Provider>
        )
      }
      {
        multipleForm && !isRecord && (
          <FormContext.Provider value={{ submitOnChange: false }}>
            <Formik initialValues={{}} onSubmit={handleFormSelection}>
              {renderFormListDialog}
            </Formik>
          </FormContext.Provider>
        )
      }
    </>
  );
};

export default CreateDocumentByType;
