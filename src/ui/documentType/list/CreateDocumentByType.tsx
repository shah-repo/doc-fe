import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Formik, FormikProps } from 'formik';
import { get, isEmpty, isNull } from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SM } from '../../../App';
import { MomentFormats, getFormattedDateString } from '../../../common/utils/date';
import { companySelectors } from '../../../state/ducks/company';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { documentTypeActions, documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { DOC_TYPE_GROUP_OPTION, DocumentType, DocumentTypeById, DocumentTypeByIdForm } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, HeaderTableType } from '../../../state/ducks/documentRevisions/types';
import { documentsActions } from '../../../state/ducks/documents';
import { DocumentProposedId } from '../../../state/ducks/documents/types';
import { userManagementSelectors } from '../../../state/ducks/userManagement';
import { ApplicationState } from '../../../state/reducers';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import Text from '../../components/Text';
import ExportListIcon from '../../components/common/kendo/ExportListIcon';
import { FormContext } from '../../components/forms/FormContext';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { toastError } from '../../components/notifications';
import ExportListDialog from '../../document.revision/list/ExportListDialog/ExportListDialog';
import { documentVersionPath } from '../../document.revision/utils/paths';
import { toDocumentRevisionFormValuesForOutput, toNewVersionRequestBody } from '../../documentRevision/forms/transform';
import CustomLabelTooltip from '../../hooks/docCustomization/CustomLabelTooltip';
import { useCreateDocumentByTypeButton } from '../../hooks/docCustomization/useCustomization';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import FormListDialog from '../dialogs/FormListDialog/FormListDialog.presenter';
import MultipleFormTemplateDialog from '../dialogs/MultipleFormTemplateDialog';
import { filterSecurityGroupsForQms } from './helpers';
import { styles } from './styles';

interface MultipleFormInitialValues {
  selectType: OptionType[]
}

interface Props {
  isByCategory: boolean
  labelName: string
  documentTypeId?: string
  categoryName?: string
  headers: HeaderTableType[]
  tableData: any[]
  isGrouped: boolean
}

type DocCreator = (form: DocumentRevision) => void;

export const useHandleCreateDoc = (selectedDocumentTypeId: string): DocCreator => {
  const selectedDocumentType = useSelector(documentTypeSelectors.byId)[selectedDocumentTypeId];
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const history = useHistory();
  const { _documentRevisionFormState } = SM.useStores();
  const [form, setForm] = useState<DocumentRevision>();
  const fetchDocIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const fetchDocIdAsync = useAsync<DocumentProposedId>({
    onSuccess: (data) => {
      createDoc(data?.docId as string);
    },
    onError: (error) => {
      toastError(error);
    },
  });
  const createDocAction = useActionCreator(documentRevisionsActions.create);
  const createDocAsync = useAsync<DocumentRevision>({
    onSuccess: (documentRevision) => {
      const path = documentVersionPath(documentRevision?.id ?? '', documentRevision?.document?.id ?? '');
      if (_documentRevisionFormState?.showPartInDialog) {
        _documentRevisionFormState?.setNewlyCreatedDocumentRevision(documentRevision);
      } else {
        history.push(path);
      }
    },
    onError: (error) => {
      toastError(error);
    },
  });

  const createDoc = (docId: string) => {
    const formValues = toDocumentRevisionFormValuesForOutput(form as DocumentRevision, selectedDocumentType);
    const outputDocumentTypes = form?.formTemplate?.outputDocumentTypes ?? [];
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
      pathname: '/document_revision/create',
      state: selectedForm,
    });
  };

  return (selectedForm: DocumentRevision) => {
    const outputDocumentTypes = selectedForm?.formTemplate?.outputDocumentTypes || [];
    if (selectedDocumentTypeId) {
      console.log('selectedDocumentTypeId');
      fetchDocIdAsync.start(fetchDocIdAction, selectedDocumentTypeId, fetchDocIdAsync);
      setForm(selectedForm);
      return;
    }
    if (outputDocumentTypes.length === 1) {
      console.log('outputDocumentTypes.length === 1');
      fetchDocIdAsync.start(fetchDocIdAction, (outputDocumentTypes[0] as any)?.id, fetchDocIdAsync);
      setForm(selectedForm);
      return;
    }
    redirect(selectedForm);
  };
};

const CreateDocumentByType: React.FunctionComponent<Props> = ({
  labelName,
  documentTypeId,
  categoryName = '',
  isByCategory,
  headers,
  isGrouped,
  tableData,
}) => {
  const title = useSelector((state: ApplicationState) => companySelectors.getNavigationTitle(state, categoryName));
  const classes = styles();

  const formDialog = useDialog();
  const multipleFormDialog = useDialog();
  const exportDialog = useDialog();

  const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);

  const formIds = useSelector(documentTypeSelectors.docRevTypeForms);
  const { isVisible, label, tooltipConfig } = useCreateDocumentByTypeButton(documentTypeId);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [initialValues, setInitialValues] = useState<MultipleFormInitialValues>({ selectType: [] });
  const [forms, setForms] = useState<DocumentTypeByIdForm[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState('');
  const selectedTypeLabel = useMemo(() => {
    return documentTypes.find((type) => type.id === selectedDocumentTypeId)?.documentTypeName ?? '';
  }, [documentTypes, selectedDocumentTypeId]);
  const handleCreateDocument = useHandleCreateDoc(selectedDocumentTypeId);

  const buttonLabel = isByCategory ? labelName : label;
  const isRecord = categoryName?.toUpperCase() === DOC_TYPE_GROUP_OPTION.RECORD;
  const isLHR = categoryName?.toUpperCase() === 'LHR';

  const resetStates = () => {
    setErrorMessage(undefined);
    setForms([]);
    setDocumentTypes([]);
    setSelectedDocumentTypeId('');
  };

  const closeMultipleFormDialog = () => {
    multipleFormDialog.close();
    resetStates();
  };

  if (!isByCategory && documentTypeId) {
    setSelectedDocumentTypeId(documentTypeId);
  }

  useEffect(() => {
    setErrorMessage(undefined);
  }, [categoryName, documentTypeId]);

  const idAsync = useAsync<DocumentTypeById>({
    onSuccess: () => {
      setForms(formIds);
      if (!isByCategory) {
        formDialog.open();
        return;
      }
      if (formIds.length === 1) {
        handleCreateDocument(formIds[0] as DocumentRevision);
        resetStates();
        return;
      }
      if (isEmpty(formIds)) {
        setErrorMessage('missing.form.error');
        return;
      }
      multipleFormDialog.open();
    },
    onError: (msg) => {
      setErrorMessage(msg);
    },
  });

  const categoryAsync = useAsync<DocumentType[]>({
    onSuccess: (data) => {
      const docTypes = data ?? [];
      setDocumentTypes(docTypes);
      if (docTypes.length === 1) {
        setSelectedDocumentTypeId(docTypes[0].id);
        setInitialValues({
          selectType: [{
            label: docTypes[0].documentTypeName,
            value: docTypes[0].id,
          }],
        });
        return;
      }
      if (isEmpty(docTypes)) {
        setErrorMessage('missing.type.error');
        multipleFormDialog.close();
        return;
      }
      setInitialValues({ selectType: [] });
    },
    onError: (msg) => {
      multipleFormDialog.close();
      setErrorMessage(msg);
    },
  });

  const handleAddButtonClick = () => {
    setErrorMessage(undefined);
    if (isByCategory) {
      multipleFormDialog.open();
      categoryAsync.start(getDocTypesByCategory, { category: categoryName }, categoryAsync);
      return;
    }
    formDialog.open();
    idAsync.start(getDocRevByIds, documentTypeId, idAsync);
  };

  const handleFormSelection = (docRevId) => {
    if (!docRevId) {
      return;
    }
    const selectedForm = formIds.find((form) => form.id === docRevId);
    handleCreateDocument(selectedForm as DocumentRevision);
    resetStates();
  };

  const handleDocTypeSelection = (docTypeId) => {
    if (!docTypeId) {
      return;
    }
    setSelectedDocumentTypeId(docTypeId);
  };

  useEffect(() => {
    if (selectedDocumentTypeId) {
      idAsync.start(getDocRevByIds, selectedDocumentTypeId, idAsync);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocumentTypeId]);

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
      areFormIdsLoading={idAsync.isLoading || categoryAsync.isLoading}
      {...{
        documentTypes,
        isRecord,
        closeMultipleFormDialog,
        isLHR,
      }}
    />
  );

  const renderTable = () => {
    if (!isEmpty(tableData)) {
      return tableData.map((e) => {
        const h = headers.map((column) => {
          const columnValue = get(e, column.key, '');

          switch (column.key) {
            case 'owner':
              return { [column.key]: get(e, 'owner.user.name') || '' };
            case 'docId':
              return { [column.key]: get(e, 'document.docId') || '' };
            case 'changeRequest':
              return { [column.key]: get(e, 'changeRequest.crId') || '' };
            case 'status':
              return { [column.key]: get(e, 'displayStatus') || '' };
            default:
              if (moment(columnValue, moment.ISO_8601, true).isValid()) {
                return {
                  [column.key]: getFormattedDateString(columnValue, MomentFormats.MonthDateYear),
                };
              } else {
                return { [column.key]: isNull(columnValue) ? '' : columnValue };
              }
          }
        });
        const rows = h.reduce(function (result, current) {
          return Object.assign(result, current);
        }, {});
        return rows;
      });
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: '' }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };

  const data = exportDialog.isOpen ? renderTable() : [];

  if (!isVisible) {
    return null;
  }
  return (
    <>
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <GridTitle title={title} />
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            className={classes.exportListbutton}
            id="ListPresenter-export-list"
            data-cy="document.revision.export.list"
            onClick={exportDialog.open}
            disabled={isGrouped}
          >
            <ExportListIcon isGrouped={isGrouped} />
            <Text translation="document.revision.export.list" />
          </Button>
          <ExportListDialog
            {...{ headers, data }}
            dialog={exportDialog}
            customFileName="DocumentList"
          />
          <CustomLabelTooltip {...{ tooltipConfig }}>
            <Button
              className={classes.createButton}
              onClick={handleAddButtonClick}
              id="DocumentByTypeListPresenter-openDocRev"
            >
              <Text
                message={buttonLabel}
                values={{ name: labelName }}
              />
            </Button>
          </CustomLabelTooltip>
        </Grid>
      </Grid>
      {
        errorMessage && (
          <div style={{ color: 'red' }} id="DocumentByTypeListPresenter-showError">
            <Text
              message={errorMessage}
              values={{ name: isByCategory ? selectedTypeLabel : labelName }}
            />
          </div>
        )
      }
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik initialValues={initialValues} enableReinitialize onSubmit={handleDocTypeSelection}>
          {renderFormTemplateDialog}
        </Formik>
      </FormContext.Provider>
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik initialValues={{}} onSubmit={handleFormSelection}>
          {renderFormListDialog}
        </Formik>
      </FormContext.Provider>
    </>
  );
};

export default CreateDocumentByType;
