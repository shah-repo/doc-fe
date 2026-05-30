import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Formik, FormikProps } from 'formik';
import { get, isEmpty, isNull } from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SM } from '../../../App';
import { translate } from '../../../common/intl';
import { MomentFormats, useDate } from '../../../common/utils/date';
import { companySelectors } from '../../../state/ducks/company';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { documentTypeActions, documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { DOC_TYPE_GROUP_OPTION, DOCUMENT_NUMBERING_STYLE, DocumentType, DocumentTypeById, DocumentTypeByIdForm } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, HeaderTableType } from '../../../state/ducks/documentRevisions/types';
import { documentsActions } from '../../../state/ducks/documents';
import { DocumentProposedId } from '../../../state/ducks/documents/types';
import { ApplicationState } from '../../../state/reducers';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import SearchBar from '../../components/KeywordSearch';
import Text from '../../components/Text';
import ExportListIcon from '../../components/common/kendo/ExportListIcon';
import { FormContext } from '../../components/forms/FormContext';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { toastError } from '../../components/notifications';
import ExportListDialog from '../../document.revision/list/ExportListDialog/ExportListDialog';
import { documentVersionPath } from '../../document.revision/utils/paths';
import { toDocumentRevisionFormValuesForOutput, toNewVersionRequestBody } from '../../documentRevision/forms/transform';
import FBDataStore from '../../form.builder/FBStore/FBDataStore';
import CustomLabelTooltip from '../../hooks/docCustomization/CustomLabelTooltip';
import { useCreateDocumentByTypeButton } from '../../hooks/docCustomization/useCustomization';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import useDocTypeGroups from '../../hooks/useDocTypeGroups';
import FormListDialog from '../dialogs/FormListDialog/FormListDialog.presenter';
import MultipleFormTemplateDialog from '../dialogs/MultipleFormTemplateDialog';
import useStyles from './styles';

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
  isKeywordSearchEnabled?: boolean
  tableName?: string
}

type DocCreator = (form: DocumentRevision, docId?: string) => void;

export const useHandleCreateDoc = (selectedDocumentTypeId = ''): DocCreator => {
  const selectedDocumentType = useSelector(documentTypeSelectors.byId)[selectedDocumentTypeId];
  const getDocTypeGroups = useDocTypeGroups();
  const history = useHistory();
  const { _documentRevisionFormState } = SM.useStores();

  const formRef = useRef<DocumentRevision | null>(null);

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
        FBDataStore.newlyCreatedDocInfo = { documentId: documentRevision?.document?.id, docRevId: documentRevision?.id };
      } else {
        history.push(path);
      }
    },
    onError: (error) => {
      toastError(error);
    },
  });

  const createDoc = (docId: string) => {
    const currentForm = formRef.current;

    if (!currentForm) {
      return;
    }

    const formValues = toDocumentRevisionFormValuesForOutput(currentForm, selectedDocumentType);
    const outputDocumentType = (currentForm?.formTemplate?.outputDocumentTypes[0] ?? {}) as DocumentType;
    formValues.securityGroups = getDocTypeGroups(outputDocumentType);

    const data = toNewVersionRequestBody(formValues);
    data.formDocument = { id: formValues?.formDocument?.id };
    data.document = {
      ...data.document,
      docId: docId?.trim(),
    };

    createDocAsync.start(createDocAction, data, createDocAsync);
  };

  const redirect = (selectedForm = formRef.current) => {
    history.push({
      pathname: '/document_revision/create',
      state: selectedForm,
    });
  };

  return (selectedForm: DocumentRevision, docId?) => {
    const outputDocumentTypes = selectedForm?.formTemplate?.outputDocumentTypes || [];
    formRef.current = selectedForm;

    if (docId) {
      createDoc(docId);
      return;
    }

    if (selectedDocumentTypeId) {
      fetchDocIdAsync.start(fetchDocIdAction, selectedDocumentTypeId, fetchDocIdAsync);
      return;
    }

    if (outputDocumentTypes.length === 1) {
      fetchDocIdAsync.start(fetchDocIdAction, (outputDocumentTypes[0] as any)?.id, fetchDocIdAsync);
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
  isKeywordSearchEnabled,
  tableName,
}) => {
  const title = useSelector((state: ApplicationState) => companySelectors.getNavigationTitle(state, categoryName));
  const classes = useStyles();
  const { getFormattedDateString } = useDate();

  const formDialog = useDialog();
  const multipleFormDialog = useDialog();
  const exportDialog = useDialog();

  const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIdsWithNumberingStyle);

  const formIds = useSelector(documentTypeSelectors.docRevTypeForms);

  const { isVisible, label, tooltipConfig } = useCreateDocumentByTypeButton(documentTypeId);

  const canCreateRevision = true;

  const [errorMessage, setErrorMessage] = useState<string>();
  const [initialValues, setInitialValues] = useState<MultipleFormInitialValues>({ selectType: [] });
  const [forms, setForms] = useState<DocumentTypeByIdForm[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  const [numberingStyle, setNumberingStyle] = useState<DOCUMENT_NUMBERING_STYLE>();
  const isCustomerTypeNumbering = numberingStyle === DOCUMENT_NUMBERING_STYLE.CUSTOMER;

  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState('');
  const [selectedForm, setSelectedForm] = useState<DocumentTypeByIdForm | undefined>();

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
        setSelectedForm(formIds[0]);
        if (!isCustomerTypeNumbering) {
          handleCreateDocument(formIds[0] as DocumentRevision);
          resetStates();
          return;
        }
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
      const activeDocTypes = docTypes.filter(docType => docType.active);
      if (activeDocTypes.length === 1) {
        setSelectedDocumentTypeId(activeDocTypes[0].id);
        setInitialValues({
          selectType: [{
            label: activeDocTypes[0].documentTypeName,
            value: activeDocTypes[0].id,
          }],
        });
        setNumberingStyle(docTypes[0].numberingStyle);
        return;
      }
      if (isEmpty(activeDocTypes)) {
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
    if (!isCustomerTypeNumbering) {
      handleCreateDocument(selectedForm as DocumentRevision);
      resetStates();
    } else {
      setSelectedForm(selectedForm);
    }
  };

  const handleUserSubmit = (docId: string) => {
    if (!selectedForm) {
      return;
    }

    handleCreateDocument(selectedForm as DocumentRevision, docId);
    resetStates();
  };

  const handleDocTypeSelection = (docTypeId) => {
    if (!docTypeId) {
      return;
    }
    const selectedDocumentType = documentTypes.find(docType => docType.id === docTypeId);
    setNumberingStyle(selectedDocumentType?.numberingStyle);
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
      handleUserSubmit={handleUserSubmit}
      formIds={forms}
      numberingStyle={numberingStyle}
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
              }

              if (Array.isArray(columnValue)) {
                return {
                  [column.key]: columnValue.join(', '),
                };
              }

              return { [column.key]: isNull(columnValue) ? '' : columnValue };
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
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <GridTitle title={title} />
            </Grid>
            {isKeywordSearchEnabled && title && (
              <Grid item xs>
                <SearchBar tableName={tableName} />
              </Grid>
            )}
          </Grid>
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
            categoryName={categoryName}
            customFileName="DocumentList"
            isMultiplePagesDownloadAllowed
          />
          <Box display="inline-flex" alignItems="center">
            <CustomLabelTooltip {...{ tooltipConfig }}>
              <Button
                className={classes.createButton}
                onClick={handleAddButtonClick}
                id="DocumentByTypeListPresenter-openDocRev"
                data-cy="document-by-type-list-presenter-open-doc-rev"
                disabled={!canCreateRevision}
              >
                <Text message={buttonLabel} values={{ name: labelName }} />
              </Button>
            </CustomLabelTooltip>
            {!canCreateRevision && (
              <Tooltip title={translate('documentRevision.create.not.allowed.msg')}>
                <FontAwesomeIcon icon={solid('lock')} />
              </Tooltip>
            )}
          </Box>
        </Grid>
      </Grid>
      {errorMessage && (
        <div
          className={classes.errorBlock}
          id="DocumentByTypeListPresenter-showError"
        >
          <Text
            message={errorMessage}
            values={{ name: isByCategory ? selectedTypeLabel : labelName }}
          />
        </div>
      )}
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleDocTypeSelection}
        >
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
