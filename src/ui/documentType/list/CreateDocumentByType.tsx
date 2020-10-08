import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Formik, FormikProps } from "formik";
import { get, isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as ExportIcon } from "../../../assets/images/icon_export_data.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevision, documentRevisionsActions, HeaderTableType } from "../../../state/ducks/documentRevisions";
import { DocumentType, documentTypeActions, DocumentTypeById, DocumentTypeByIdForm, documentTypeSelectors, DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentProposedId, documentsActions } from "../../../state/ducks/documents";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { FormContext } from "../../components/forms/FormContext";
import Text from "../../components/Text";
import ExportListDialog from "../../document.revision/list/ExportListDialog/ExportListDialog";
import { documentVersionPath } from "../../document.revision/utils/paths";
import { toDocumentRevisionFormValuesForOutput, toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { useCreateDocumentByTypeButton } from "../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import FormListDialog from "../dialogs/FormListDialog/FormListDialog.presenter";
import { MultipleFormTemplateDialog } from "../dialogs/MultipleFormTemplateDialog";
import { filterSecurityGroupsForQms } from "./helpers";
import { styles } from "./styles";

interface MultipleFormInitialValues {
  selectType: OptionType[];
}

interface Props {
  isByCategory: boolean;
  labelName: string;
  documentTypeId?: string;
  categoryName?: string;
  headers: HeaderTableType[];
  tableData: any[];
  supportExportList: boolean;
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
  headers,
  tableData,
  supportExportList,
}) => {
  const handleCreateDocument = useHandleCreateDoc();
  const classes = styles();

  const formDialog = useDialog();
  const multipleFormDialog = useDialog();
  const exportDialog = useDialog();

  const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);

  const formIds = useSelector(documentTypeSelectors.formIds);
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypesByCategory);
  const [isVisible, label] = useCreateDocumentByTypeButton(documentTypeId);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [initialValues, setInitialValues] = useState<MultipleFormInitialValues>({ selectType: [] });
  const [forms, setForms] = useState<DocumentTypeByIdForm[]>([]);
  const buttonLabel = isByCategory ? labelName : label;
  const isRecord = categoryName?.toUpperCase() === DOC_TYPE_GROUP_OPTION.RECORD;
  const closeMultipleFormDialog = () => {
    multipleFormDialog.close();
    setForms([]);
  };
  if (!isByCategory && documentTypeId) {
    selectedDocumentTypeId = documentTypeId;
  }

  useEffect(() => {
    setErrorMessage(undefined);
  }, [documentTypeId]);

  const idAsync = useAsync<DocumentTypeById>({
    onSuccess: () => {
      setForms(formIds);
      if (!isByCategory) {
        formDialog.open();
        return;
      }
      if (formIds.length === 1) {
        handleCreateDocument(formIds[0] as DocumentRevision);
        setForms([]);
        return;
      }
      if (isEmpty(formIds)) {
        setErrorMessage("missing.form.error");
        return;
      }
      multipleFormDialog.open();
    },
    onError: (msg) => setErrorMessage(msg),
  });

  const categoryAsync = useAsync<DocumentType[]>({
    onSuccess: () => {
      if (documentTypes.length === 1) {
        selectedDocumentTypeId = documentTypes[0].id;
        setInitialValues({
          selectType: [{
            label: documentTypes[0].documentTypeName,
            value: documentTypes[0].id,
          }],
        });
        idAsync.start(getDocRevByIds, documentTypes[0].id, idAsync);
        return;
      }
      if (isEmpty(documentTypes)) {
        setErrorMessage("missing.type.error");
        return;
      }
      setInitialValues({ selectType: [] });
      multipleFormDialog.open();
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
    setForms([]);
  };

  const handleDocTypeSelection = (docTypeId) => {
    if (!docTypeId) {
      return;
    }
    selectedDocumentTypeId = docTypeId;
    selectedTypeLabel = documentTypes.find((type) => type.id === docTypeId)?.documentTypeName || "";
    idAsync.start(getDocRevByIds, docTypeId, idAsync);
  };

  const renderFormListDialog = (props: FormikProps<any>) => (
    <FormListDialog
      {...props}
      dialog={formDialog}
      handleSelection={handleFormSelection}
      formIds={formIds}
    />
  );

  const renderFormTemplateDialog = (props: FormikProps<any>) => (
    <MultipleFormTemplateDialog
      {...props}
      dialog={multipleFormDialog}
      handleSelection={handleDocTypeSelection}
      handleTemplateSelection={handleFormSelection}
      formIds={forms}
      {...{
        documentTypes,
        isRecord,
        closeMultipleFormDialog,
      }}
    />
  );

  const renderTable = () => {
    if (!isEmpty(tableData)) {
      return tableData.map((e) => {
        const h = headers.map((column) => {
          if (moment(get(e, column.key, ""), moment.ISO_8601, true).isValid()) {
            return {
              [column.key]: getFormattedDateString(get(e, column.key, ""), MomentFormats.MonthDateYear) || "",
            };
          }
          return { [column.key]: get(e, column.key, "") };
        });
        const rows = h.reduce(function(result, current) {
          return Object.assign(result, current);
        }, {});
        return rows;
      });
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: "" }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };

  const data = exportDialog.isOpen ? renderTable() : [];

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Grid item={true} xs={6} style={{ textAlign: "right" }}>
        { supportExportList && <Button
          variant="outlined"
          color="primary"
          className={classes.exportListbutton}
          style={{ marginRight: 5 }}
          id="ListPresenter-export-list"
          data-cy="document.revision.export.list"
          onClick={exportDialog.open}
        >
          <Box marginRight={1}>
            <ExportIcon className={classes.iconSvg} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>}
        <ExportListDialog
          {...{ headers, data  }}
          dialog={exportDialog}
        />
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
        <FormContext.Provider value={{ submitOnChange: false }}>
          <Formik initialValues={initialValues} onSubmit={handleDocTypeSelection}>
            {renderFormTemplateDialog}
          </Formik>
        </FormContext.Provider>
      }
      {
        <FormContext.Provider value={{ submitOnChange: false }}>
          <Formik initialValues={{}} onSubmit={handleFormSelection}>
            {renderFormListDialog}
          </Formik>
        </FormContext.Provider>
      }
    </>
  );
};

export default CreateDocumentByType;
