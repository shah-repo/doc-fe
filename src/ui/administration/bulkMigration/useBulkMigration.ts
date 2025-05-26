import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { intl, translate } from '../../../common/intl';
import { encodeString } from '../../../common/utils/helpers';
import apiClient from '../../../state/apiClient';
import { BULK_MIGRATION_CANCEL_SCAN, BULK_MIGRATION_GET_DOCUMENT_TYPES, BULK_MIGRATION_GET_DOCUMENT_TYPE_FORM_DETAILS, BULK_MIGRATION_GET_ELIGIBLE_REVS, BULK_MIGRATION_GET_REVISION_MAPPING_PREVIEW, BULK_MIGRATION_GET_SCAN_DETAILS, BULK_MIGRATION_GET_SCAN_RESULTS, BULK_MIGRATION_GET_SCAN_REVISIONS_FOR_PREVIEW, BULK_MIGRATION_REGISTER_SCAN, BULK_MIGRATION_REGISTER_SCAN_FOR_RUN, BULK_MIGRATION_START_REVS_MIGRATION, BULK_MIGRATION_UPDATE_SCAN } from '../../../state/ducks/company/constants';
import { DocumentRevision, ErrorCodes } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import { toastError, toastInfo, toastSuccess } from '../../components/notifications';
import { SUPPLIERS_OPTIONS_URL } from '../../constants/urls';
import { FBFormState } from '../../form.builder';
import { BulkMigrationDocType, BulkMigrationScanDetails, DetailedScanResult, FormFieldSchema, ListType, MappingOptions, SelectedItemDetails, SortDirection, SupplierScanResultRevision } from './interface';
import { promptUserToRerunScan } from './utils';

export const useBulkMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [documentTypesList, setDocumentTypesList] = useState<BulkMigrationDocType[]>([]);

  const [fromFormRevsList, setFromFormRevsList] = useState<DocumentRevision[]>([]);
  const [toFormRevsList, setToFormRevsList] = useState<DocumentRevision[]>([]);

  const [fromDocumentTypeId, setFromDocumentTypeId] = useState<string>('');
  const [fromFormRevId, setFromFormRevId] = useState<string>('');
  const [toDocumentTypeId, setToDocumentTypeId] = useState<string>('');
  const [toFormRevId, setToFormRevId] = useState<string>('');

  const [isScanRunning, setIsScanRunning] = useState(false);

  const [eligibleRevsCount, setEligibleRevsCount] = useState<number>(0);
  const [updateRevsTable, setUpdateRevsTable] = useState<number>(0);

  const [scanDetails, setScanDetails] = useState<BulkMigrationScanDetails | null>(null);
  const [promptUserToRescanDetails, setPromptUserToRescanDetails] = useState<{isPromptUserToScan: boolean, msgParts: string[]}>({
    isPromptUserToScan: false,
    msgParts: [],
  });

  const [selectedRows, setSelectedRows] = useState<SelectedItemDetails[]>([]);

  const [previewDocRevsList, setPreviewDocRevsList] = useState<Array<DocumentRevision & {formInputKeysCount: number}>>([]);
  const [filteredDocRevsList, setFilteredDocRevsList] = useState<Array<DocumentRevision & {formInputKeysCount: number}>>([]);

  const [newFormInput, setNewFormInput] = useState<{[key: string]: string}>();
  const [fieldsUnmatched, setFieldsUnmatched] = useState<{[key: string]: string}>();

  const [rowMapping, setRowMapping] = useState(false);

  const [rows, setRows] = useState<SupplierScanResultRevision[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [selected, setSelected] = useState<SelectedItemDetails[]>([]);
  const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);
  const confirmSubmission = () => {
    setIsConfirmationDialogVisible(true);
  };

  const handleMigrationConfirmationDialogClose = () => {
    setIsConfirmationDialogVisible(false);
  };

  function commonSetUp () {
    setIsLoading(true);
    setErrorMessage('');
  }

  function catchAxiosException (exception: AxiosError): void {
    setIsLoading(false);
    if (axios.isCancel(exception)) {
      return;
    }
    if (exception?.response?.status === ErrorCodes.GATEWAY_TIMEOUT) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      const message: string = (exception?.response?.data?.message as string) ?? 'Error processing request';
      toastInfo(message);
      setErrorMessage(message);
    }
  }

  function fetchAllDocumentTypes () {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: BULK_MIGRATION_GET_DOCUMENT_TYPES,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setIsLoading(false);
        setDocumentTypesList(data);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function fetchFormRevsForDocumentType (
    documentTypeId: string,
    section: string,
  ) {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_DOCUMENT_TYPE_FORM_DETAILS}/${documentTypeId}?isGetNewSchema=${section === ListType.FROM ? 'false' : 'true'}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setIsLoading(false);

        const formRevs = data;
        if (section === ListType.FROM) {
          setFromFormRevsList(formRevs);
        } else if (section === ListType.TO) {
          setToFormRevsList(formRevs);
        }
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function fetchEligibleRevisionsOfRevType (formRevId: string) {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_ELIGIBLE_REVS}/${formRevId}?isCountOnly=true`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setIsLoading(false);
        setEligibleRevsCount(data);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function registerScanForRevisions () {
    commonSetUp();
    if (toFormRevId) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${BULK_MIGRATION_REGISTER_SCAN}`,
        data: {
          fromDocumentTypeId,
          fromFormRevId,
          toDocumentTypeId,
          toFormRevId,
        },
        headers: {
          Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
        },
      };

      apiClient
        .request(requestConfig)
        .then(({ data }) => {
          const {
            scanDetails, alreadyUpgradedScanEntryIds, irrelevantScanIds,
            mismatchingStatusScanIds, newRevIds,
          } = data as DetailedScanResult;
          setIsLoading(false);
          setScanDetails(scanDetails);

          const { msgParts, isPromptUserToScan }
            = promptUserToRerunScan({ alreadyUpgradedScanEntryIds, irrelevantScanIds, mismatchingStatusScanIds, newRevIds });
          setPromptUserToRescanDetails({ isPromptUserToScan, msgParts });
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function getScanDetails () {
    if (scanDetails?.id) {
      const requestConfig: AxiosRequestConfig = {
        method: 'get',
        url: `${BULK_MIGRATION_GET_SCAN_DETAILS}/${scanDetails.id}`,
        headers: {
          Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
        },
      };

      apiClient
        .request(requestConfig)
        .then(({ data }) => {
          setScanDetails(data);
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function startRevisionsScan () {
    if (!scanDetails?.toFormSchema?.length) {
      toastError(`Mapping Logic has not been set. 
        Click on "Mapping Logic" to define how the previous form schema maps to the current one`);
      return;
    }

    commonSetUp();
    setIsScanRunning(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_REGISTER_SCAN_FOR_RUN}/${scanDetails?.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };

    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setIsLoading(false);
        setIsScanRunning(false);
        setScanDetails(data);
        setPromptUserToRescanDetails({ isPromptUserToScan: false, msgParts: [] });
      })
      .catch((exception) => {
        catchAxiosException(exception);
        setIsScanRunning(false);
      });
  }

  function updateScanMapping (fromRevSchema: FormFieldSchema[], toRevSchema: FormFieldSchema[]) {
    if (scanDetails) {
      commonSetUp();
      const requestConfig: AxiosRequestConfig = {
        method: 'patch',
        url: `${BULK_MIGRATION_UPDATE_SCAN}/${scanDetails.id}`,
        data: {
          fromFormSchema: fromRevSchema,
          toFormSchema: toRevSchema,
        },
        headers: {
          Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
        },
      };

      apiClient
        .request(requestConfig)
        .then(({ data }) => {
          setIsLoading(false);
          toastSuccess(translate('bulk.migration.scan.mapping.logic.info.message'));
          setScanDetails(data);
          setUpdateRevsTable(updateRevsTable => updateRevsTable + 1);
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function cancelScanForRevisions () {
    commonSetUp();
    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_CANCEL_SCAN}/${scanDetails?.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };

    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setIsLoading(false);
        setScanDetails(data);
        toastSuccess(translate('bulk.migration.scan.request.cancelled.message'));
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  const handleMigrationConfirmation = (selectedRows: SelectedItemDetails[], employeePassword: string) => {
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_START_REVS_MIGRATION}/${scanDetails?.id}`,
      data: {
        revIds: selectedRows.map(entry => entry.docRevId),
        password: employeePassword,
      },
      headers: {
        Authorization: `bearer_password ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}:${encodeString(employeePassword)}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setIsLoading(false);
        handleMigrationConfirmationDialogClose();
        toastSuccess(translate('bulk.migration.migration.job.placed.success.message'));
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  };

  function fetchAllEligibleRevisions (scanDetailsId: string) {
    setIsLoading(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_SCAN_REVISIONS_FOR_PREVIEW}/${scanDetailsId}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setPreviewDocRevsList(data);
        setFilteredDocRevsList(data);
        setIsLoading(false);
      })
      .catch((exception) => {
        setIsLoading(false);
        toastError(exception?.response?.data?.message);
      });
  }

  function getPreviewForDocRev (scanDetailsId: string, docRevSelected: DocumentRevision, formState: FBFormState) {
    setIsLoading(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_REVISION_MAPPING_PREVIEW}/${scanDetailsId}/${docRevSelected.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        const { newFormInput, fieldNamesUnmatched } = data;
        setNewFormInput(newFormInput);
        setFieldsUnmatched(fieldNamesUnmatched);
        setIsLoading(false);
      })
      .catch((exception) => {
        setIsLoading(false);
        toastError(exception?.response?.data?.message);
      });
  }

  function fetchScanSupplierRevisions (
    scanId: string, page: number, rowsPerPage: number, orderBy: string, order: SortDirection, showActionableRows: boolean,
    searchQueries: {[key: string]: string},
  ) {
    setIsLoading(true);
    setErrorMessage('');
    setSelected([]);

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_GET_SCAN_RESULTS}/${scanId}?offset=${page}&limit=${rowsPerPage}&orderBy=${orderBy}&sortOrder=${(order as string).toLocaleUpperCase()}&showActionableOnly=${showActionableRows}`,
      data: {
        searchQueries,
      },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        setIsLoading(false);
        const { items, totalCount }: {items: SupplierScanResultRevision[], totalCount: number} = data;

        setRows(items);
        setTotalCount(totalCount);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function getPreviewForDocRevRevsTable (
    scanId: string, row: SupplierScanResultRevision, callbackFn: (row: SupplierScanResultRevision) => void,
  ) {
    setRowMapping(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_REVISION_MAPPING_PREVIEW}/${scanId}/${row.docRevId}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        const { newFormInput, fieldNamesUnmatched } = data;
        row.newFormInput = newFormInput;
        row.fieldNamesUnmatched = fieldNamesUnmatched;
        row.isMapped = true;
        callbackFn(row);

        setRowMapping(false);
        return row;
      })
      .catch((exception) => {
        setRowMapping(false);
        toastError(exception?.response?.data?.message);
      });
  }

  async function getConfiguredSupplierOptions (name: string): Promise<MappingOptions[]> {
    const type = name.split('-').length > 0 ? name.split('-')[1] : '';
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${SUPPLIERS_OPTIONS_URL}/${type}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    return await apiClient
      .request(requestConfig)
      .then(({ data }) => data);
  }

  return {
    isLoading,
    isScanRunning,
    errorMessage,
    documentTypesList,
    fromFormRevsList,
    toFormRevsList,
    fromDocumentTypeId,
    fromFormRevId,
    toDocumentTypeId,
    toFormRevId,
    setFromDocumentTypeId,
    setFromFormRevId,
    setToDocumentTypeId,
    setToFormRevId,
    eligibleRevsCount,
    setEligibleRevsCount,
    promptUserToRescanDetails,
    updateRevsTable,
    scanDetails,
    selectedRows,
    setSelectedRows,
    fetchAllDocumentTypes,
    fetchFormRevsForDocumentType,
    fetchEligibleRevisionsOfRevType,
    registerScanForRevisions,
    getScanDetails,
    startRevisionsScan,
    updateScanMapping,
    cancelScanForRevisions,
    handleMigrationConfirmation,
    isConfirmationDialogVisible,
    confirmSubmission,
    handleMigrationConfirmationDialogClose,
    previewDocRevsList,
    filteredDocRevsList,
    setFilteredDocRevsList,
    newFormInput,
    fieldsUnmatched,
    fetchAllEligibleRevisions,
    getPreviewForDocRev,
    rowMapping,
    getPreviewForDocRevRevsTable,
    rows,
    totalCount,
    selected,
    setSelected,
    fetchScanSupplierRevisions,
    getConfiguredSupplierOptions,
  };
};
