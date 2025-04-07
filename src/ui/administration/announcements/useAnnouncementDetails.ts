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
  const [conflictingElements, setConflictingElements] = useState<{ [key: string]: IConflictingItem }>({});

  const [isFormUpgradeDone, setIsFormUpgradeDone] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function catchAxiosException (exception: any) {
    setIsLoading(false);
    if (exception?.response?.status === 504) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      const errMessage = exception?.response.data?.message;
      let errMsgToShow = errMessage;
      if (Array.isArray(errMessage)) {
        errMsgToShow = errMessage[0];
      }
      toastError(errMsgToShow);
      setErrorMessage(errMsgToShow);
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
        const { conflictingElements, isFormUpgradeDone } = data as {
          conflictingElements: { [key: string]: IConflictingItem }
          isFormUpgradeDone: boolean
        };
        setIsLoading(false);
        setConflictingElements(conflictingElements);
        setIsFormUpgradeDone(isFormUpgradeDone ?? false);
      })
      .catch((exception) => {
        console.log(exception);
        catchAxiosException(exception);
      });
  }

  function processFormUpgrade (announcementId: string) {
    const isAnyUnresolved = Object.values(conflictingElements)
      .some(conflictingElement => !conflictingElement.isResolved && conflictingElement.mustBeResolved);
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
        conflictingElements,
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
        setIsSubmitting(false);
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
    conflictingElements,
    setConflictingElements,
  };
};
