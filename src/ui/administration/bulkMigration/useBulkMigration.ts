import axios, { AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { intl } from '../../../common/intl';
import { encodeString } from '../../../common/utils/helpers';
import apiClient from '../../../state/apiClient';
import { BULK_MIGRATION_ADD_USER_TO_GROUPS, BULK_MIGRATION_CANCEL_SCAN, BULK_MIGRATION_GET_APPROVAL_REQUIREMENTS, BULK_MIGRATION_GET_DOCUMENT_TYPES, BULK_MIGRATION_GET_DOCUMENT_TYPE_FORM_DETAILS, BULK_MIGRATION_GET_ELIGIBLE_REVS, BULK_MIGRATION_GET_REVISION_MAPPING_PREVIEW, BULK_MIGRATION_GET_SCAN_DETAILS, BULK_MIGRATION_GET_SCAN_RESULTS, BULK_MIGRATION_GET_SCAN_REVISIONS_FOR_PREVIEW, BULK_MIGRATION_REGISTER_SCAN, BULK_MIGRATION_REGISTER_SCAN_FOR_RUN, BULK_MIGRATION_START_REVS_MIGRATION, BULK_MIGRATION_UPDATE_SCAN } from '../../../state/ducks/company/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import { toastError, toastInfo, toastSuccess } from '../../components/notifications';
import { FBFormState } from '../../form.builder';
import { IApprovalRequirements, IBulkMigrationDocumentType, IBulkMigrationScanDetails, ISchemaItem, ISelectedDetails, ISupplierScanResultRev, SortDirection } from './interface';

export const useBulkMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [documentTypesList, setDocumentTypesList] = useState<IBulkMigrationDocumentType[]>([]);

  const [fromFormRevsList, setFromFormRevsList] = useState<DocumentRevision[]>([]);
  const [toFormRevsList, setToFormRevsList] = useState<DocumentRevision[]>([]);

  const [fromDocumentTypeId, setFromDocumentTypeId] = useState<string>('');
  const [fromFormRevId, setFromFormRevId] = useState<string>('');
  const [toDocumentTypeId, setToDocumentTypeId] = useState<string>('');
  const [toFormRevId, setToFormRevId] = useState<string>('');

  const [eligibleRevsCount, setEligibleRevsCount] = useState<number>(0);
  const [updateRevsTable, setUpdateRevsTable] = useState<number>(0);

  const [scanDetails, setScanDetails] = useState<IBulkMigrationScanDetails | null>(null);
  const [rerunScanDetails, setRerunScanDetails] = useState<{irrelevantRevsCount: number, newRevsCount: number}>({
    irrelevantRevsCount: 0,
    newRevsCount: 0,
  });

  const [selectedRows, setSelectedRows] = useState<ISelectedDetails[]>([]);
  const [approvalRequirements, setApprovalRequirements] = useState<IApprovalRequirements>();

  const [previewDocRevsList, setPreviewDocRevsList] = useState<Array<DocumentRevision & {formInputKeysCount: number}>>([]);
  const [filteredDocRevsList, setFilteredDocRevsList] = useState<Array<DocumentRevision & {formInputKeysCount: number}>>([]);

  const [newFormInput, setNewFormInput] = useState<{[key: string]: any}>();
  const [fieldsUnmatched, setFieldsUnmatched] = useState<{[key: string]: any}>();

  const [rowMapping, setRowMapping] = useState(false);

  const [rows, setRows] = useState<ISupplierScanResultRev[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

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

  function catchAxiosException (exception: any) {
    setIsLoading(false);
    if (axios.isCancel(exception)) {
      return;
    }
    if (exception?.response?.status === 504) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      const message: string = (exception?.response.data?.message as string) ?? 'Error processing request';
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
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        // console.log(data);
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
      url: `${BULK_MIGRATION_GET_DOCUMENT_TYPE_FORM_DETAILS}/${documentTypeId}?isGetNewSchema=${section === 'from' ? 'false' : 'true'}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        // console.log(data);
        setIsLoading(false);

        const { formRevs } = data;
        if (section === 'from') {
          setFromFormRevsList(formRevs);
        } else if (section === 'to') {
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
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        // console.log(data);
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
        // cancelToken: call.token,
      };

      apiClient
        .request(requestConfig)
        .then((resp) => resp)
        .then(({ data }) => {
          const { scanDetails, irrelevantRevsCount, newRevsCount } = data;
          setIsLoading(false);
          setScanDetails(scanDetails);
          setRerunScanDetails({
            irrelevantRevsCount, newRevsCount,
          });
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
        // cancelToken: call.token,
      };

      apiClient
        .request(requestConfig)
        .then((resp) => resp)
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
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_REGISTER_SCAN_FOR_RUN}/${scanDetails?.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };

    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        console.log(data);
        setIsLoading(false);
        setScanDetails(data);
        toastSuccess(
          'Scan request has been submitted. Please check back in some time.',
        );
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function updateScanMapping (fromRevSchema: ISchemaItem[], toRevSchema: ISchemaItem[]) {
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
        // cancelToken: call.token,
      };

      apiClient
        .request(requestConfig)
        .then((resp) => resp)
        .then(({ data }) => {
          setIsLoading(false);
          toastSuccess(
            'Scan mapping logic has been updated. Click Preview to see this logic in action.',
          );
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
      // cancelToken: call.token,
    };

    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsLoading(false);
        setScanDetails(data);
        toastSuccess('Scan request has been canceled. Please refresh.');
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  const handleMigrationConfirmation = (employeePassword: string) => {
    // Take all the ones selected & send to BE
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_START_REVS_MIGRATION}/${scanDetails?.id}`,
      data: {
        revIds: selectedRows.map(entry => entry.id),
        password: employeePassword,
      },
      headers: {
        Authorization: `bearer_password ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}:${encodeString(employeePassword)}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsLoading(false);
        handleMigrationConfirmationDialogClose();
        toastSuccess('Supplier Migration job request has been placed. Please check back in some time.');
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  };

  function fetchApprovalRequirements (toDocumentTypeId: string) {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_APPROVAL_REQUIREMENTS}/${toDocumentTypeId}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setApprovalRequirements(data);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function addUserToGroups (toDocumentTypeId: string) {
    if (!approvalRequirements?.missingGroups?.length) {
      return;
    }

    const requestConfig: AxiosRequestConfig = {
      method: 'patch',
      url: `${BULK_MIGRATION_ADD_USER_TO_GROUPS}/${toDocumentTypeId}`,
      data: {
        missingGroups: approvalRequirements?.missingGroups,
      },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setApprovalRequirements(data);
        toastSuccess('Automation user has been added to the required groups successfully');
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function fetchAllEligibleRevisions (scanDetailsId: string) {
    setIsLoading(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_SCAN_REVISIONS_FOR_PREVIEW}/${scanDetailsId}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setPreviewDocRevsList(data);
        setFilteredDocRevsList(data);
        setIsLoading(false);
      })
      .catch((exception) => {
        setIsLoading(false);
        toastError(exception?.response.data?.message);
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
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { newFormInput, fieldNamesUnmatched } = data;
        setNewFormInput(newFormInput);
        setFieldsUnmatched(fieldNamesUnmatched);

        formState?.setValues(newFormInput);
        setIsLoading(false);
      })
      .catch((exception) => {
        setIsLoading(false);
        toastError(exception?.response.data?.message);
      });
  }

  function fetchScanSupplierRevisions (
    scanId: string, page: number, rowsPerPage: number, orderBy: string, order: SortDirection, isShowActionableRows: boolean,
    searchQueries: {[key: string]: string},
  ) {
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_GET_SCAN_RESULTS}/${scanId}?offset=${page}&limit=${rowsPerPage}&orderBy=${orderBy}
      &sortOrder=${(order as string).toLocaleUpperCase()}&isShowActionableOnly=${isShowActionableRows}`,
      data: {
        searchQueries,
      },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsLoading(false);
        const { items, totalCount }: {items: ISupplierScanResultRev[], totalCount: number} = data;

        setRows(items);
        setTotalCount(totalCount);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function getPreviewForDocRevRevsTable (
    scanId: string, row: ISupplierScanResultRev, callbackFn: (row: ISupplierScanResultRev) => void,
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
      .then((resp) => resp)
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
        toastError(exception?.response.data?.message);
      });
  }

  return {
    isLoading,
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
    rerunScanDetails,
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
    approvalRequirements,
    fetchApprovalRequirements,
    addUserToGroups,
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
    fetchScanSupplierRevisions,
  };
};
