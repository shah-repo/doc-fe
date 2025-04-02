import { AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { intl } from '../../../common/intl';
import apiClient from '../../../state/apiClient';
import { ANNOUNCEMENTS_BASE } from '../../../state/ducks/company/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import { toastError, toastSuccess } from '../../components/notifications';
import { IAnnouncementDetail, IConflictingItem } from './interface';

export const useAnnouncementDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [announcementDetailRows, setAnnouncementDetailRows] = useState<IAnnouncementDetail[]>([]);
  const [formRevsList, setFormRevsList] = useState<DocumentRevision[]>([]);

  const [selectedFormRevToUpgrade, setSelectedFormRevToUpgrade] = useState<string>('');
  const [conflictingElementsMap, setConflictingElementsMap] = useState<{ [key: string]: IConflictingItem }>({});

  const [isFormUpgradeDone, setIsFormUpgradeDone] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function catchAxiosException (exception: any) {
    setIsLoading(false);
    if (exception?.response?.status === 504) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      toastError(exception?.response.data?.message);
      setErrorMessage(exception?.response.data?.message);
    }
  }

  function getAnnouncementDetails (announcementId: string) {
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${ANNOUNCEMENTS_BASE}/${announcementId}/details`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { announcementActionEntries, formRevs } = data as {
          announcementActionEntries: IAnnouncementDetail[]
          formRevs: DocumentRevision[]
        };
        setIsLoading(false);
        setAnnouncementDetailRows(announcementActionEntries);
        setFormRevsList(formRevs);
      })
      .catch((exception) => {
        console.log(exception);
        catchAxiosException(exception);
      });
  }

  function handleFormRevSelectionToUpgrade (revIdSelected: string, announcementId: string) {
    setIsLoading(true);
    setErrorMessage('');

    setSelectedFormRevToUpgrade(revIdSelected);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${ANNOUNCEMENTS_BASE}/${announcementId}/${revIdSelected}/details`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { conflictingElementsMap, isFormUpgradeDone } = data as {
          conflictingElementsMap: { [key: string]: IConflictingItem }
          isFormUpgradeDone: boolean
        };
        setIsLoading(false);
        setConflictingElementsMap(conflictingElementsMap);
        setIsFormUpgradeDone(isFormUpgradeDone ?? false);
      })
      .catch((exception) => {
        console.log(exception);
        catchAxiosException(exception);
      });
  }

  function processFormUpgrade (announcementId: string) {
    const isAnyUnresolved = Object.values(conflictingElementsMap).some(conflictingElement => !conflictingElement.isResolved);
    if (isAnyUnresolved) {
      toastError('Please resolve all conflicts, before proceeding');
      return;
    }

    if (isSubmitting) {
      return;
    }

    if (!selectedFormRevToUpgrade) {
      return;
    }

    setIsSubmitting(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${ANNOUNCEMENTS_BASE}/${announcementId}/${selectedFormRevToUpgrade}/formUpgrade`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      data: {
        conflictingElementsMap,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsSubmitting(false);
        toastSuccess(
          `Form has been upgraded to Rev ${data.formRev?.displayRevision} . Please review and approve for next steps.`,
        );
      })
      .catch((exception) => {
        console.log(exception);
        catchAxiosException(exception);
      });
  }

  return {
    isLoading,
    errorMessage,
    isSubmitting,
    announcementDetailRows,
    selectedFormRevToUpgrade,
    formRevsList,
    isFormUpgradeDone,
    getAnnouncementDetails,
    handleFormRevSelectionToUpgrade,
    processFormUpgrade,
  };
};
