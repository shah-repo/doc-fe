import { AxiosError, AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { intl, translate } from '../../../common/intl';
import apiClient from '../../../state/apiClient';
import { ANNOUNCEMENTS_BASE } from '../../../state/ducks/company/constants';
import { DocumentRevision, ErrorCodes } from '../../../state/ducks/documentRevisions/types';
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

  function catchAxiosException (exception: AxiosError): void {
    setIsLoading(false);
    if (exception?.response?.status === ErrorCodes.GATEWAY_TIMEOUT) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      const errMessage = exception?.response?.data?.message;
      let errMsgToShow = errMessage;
      if (Array.isArray(errMessage)) {
        errMsgToShow = errMessage[0];
      }
      toastError(errMsgToShow);
      setErrorMessage(errMsgToShow);
    }
  }

  function getAnnouncementDetails (announcementId: string): void {
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${ANNOUNCEMENTS_BASE}/${announcementId}/details`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
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
        catchAxiosException(exception);
      });
  }

  function handleFormRevSelectionToUpgrade (revIdSelected: string, announcementId: string): void {
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
        catchAxiosException(exception);
      });
  }

  function processFormUpgrade (announcementId: string): void {
    const isAnyUnresolved = Object.values(conflictingElements)
      .some(conflictingElement => !conflictingElement.isResolved && conflictingElement.mustBeResolved);
    if (isAnyUnresolved) {
      toastError(translate('bulk.migration.conflict.resolve.error.message'));
      return;
    }

    if (isSubmitting || !selectedFormRevToUpgrade) {
      return;
    }

    setIsSubmitting(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${ANNOUNCEMENTS_BASE}/${announcementId}/${selectedFormRevToUpgrade}/upgradeForm`,
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
          translate('bulk.migration.upgrade.revision.success.message', { displayRevision: data.formRev?.displayRevision }),
        );
      })
      .catch((exception) => {
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
