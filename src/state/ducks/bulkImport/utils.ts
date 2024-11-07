import axios from 'axios';
import { orderBy } from 'lodash';
import Config from '../../../config';
import { APPROVALS_URL, BULK_DOWNLOAD_FILE_URL, BULK_IMPORT_URL, DOCUMENT_REVISION_IN_REVIEW_URL, DOCUMENT_REVISION_URL, DOCUMENT_REVISION_WITHDRAWN_URL } from './constants';
import { BkStatus } from './types';

const TEMPLATE_CSV = 'template.xlsx';

export interface UserState {
  employeeId: string
  sessionId: string
}

export const getDownloadTemplate = async (bulkImportId: string, userState: UserState): Promise<void> => await axios({
  url: `${Config.ApiEndpoint}${BULK_DOWNLOAD_FILE_URL}${bulkImportId}`,
  method: 'GET',
  responseType: 'blob',
  headers: {
    Authorization: `bearer ${userState.employeeId}:${userState.sessionId}`,
  },
}).then(({ data }) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', TEMPLATE_CSV);
  document.body.appendChild(link);
  link.click();
  link.remove();
});

export const postApprovals = async (approvalId: string | number, documentRevisionId: string, approvalFieldId: string, userState: UserState) => {
  try {
    const response = await axios({
      url: `${Config.ApiEndpoint}${APPROVALS_URL}`,
      method: 'POST',
      headers: {
        Authorization: `bearer ${userState.employeeId}:${userState.sessionId}`,
      },
      data: {
        assigned: {
          id: approvalId,
        },
        type: 'MASTER',
        fieldId: approvalFieldId,
        partOf: {
          id: documentRevisionId,
        },
      },
    });
    // Handle success
    return response.data;
  } catch (error) {
    // Handle failure
    return null;
  }
};

export const abandonApproval = async (approvalId: string, userState: UserState): Promise<boolean> => {
  try {
    await axios({
      url: `${Config.ApiEndpoint}${APPROVALS_URL}/${approvalId}/abandon`,
      method: 'POST',
      headers: {
        Authorization: `bearer ${userState.employeeId}:${userState.sessionId}`,
      },
    });
    // Handle success
    return true;
  } catch (error) {
    // Handle failure
    return false;
  }
};

export const patchDocumentRevisions = async (approvalIds, documentRevisionId, approvalFieldId, userState: UserState) => {
  try {
    const response = await axios({
      url: `${Config.ApiEndpoint}${DOCUMENT_REVISION_URL}${documentRevisionId}`,
      method: 'PATCH',
      headers: {
        Authorization: `bearer ${userState.employeeId}:${userState.sessionId}`,
      },
      data: {
        formInput: {
          [approvalFieldId]: approvalIds,
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save document revisions:', error);
    return null;
  }
};

export const postDocumentRevisionsInReview = async (documentRevisionId, userState: UserState) => {
  try {
    const response = await axios({
      url: `${Config.ApiEndpoint}${DOCUMENT_REVISION_IN_REVIEW_URL}${documentRevisionId}`,
      method: 'POST',
      headers: {
        Authorization: `bearer ${userState.employeeId}:${userState.sessionId}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to save document revisions in review:', error);
    return null;
  }
};

export const postDocumentRevisionsWithdrawn = async (documentRevisionId, userState: UserState) => {
  try {
    const response = await axios({
      url: `${Config.ApiEndpoint}${DOCUMENT_REVISION_WITHDRAWN_URL}${documentRevisionId}`,
      method: 'POST',
      headers: {
        Authorization: `bearer ${userState.employeeId}:${userState.sessionId}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to save document revisions in review:', error);
    return null;
  }
};

export const updateBulkImportStatus = async (bulkImportId: string, status: BkStatus, userState: UserState) => {
  try {
    const response = await axios({
      url: `${Config.ApiEndpoint}${BULK_IMPORT_URL}${bulkImportId}`,
      method: 'PATCH',
      headers: {
        Authorization: `bearer ${userState.employeeId}:${userState.sessionId}`,
      },
      data: {
        status,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to save document revisions in review:', error);
    return null;
  }
};

export const downloadFile = (data: BlobPart, fileName: string) => {
  // Create a blob object from the data
  const file = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Create a URL for the blob object
  const fileURL = URL.createObjectURL(file);

  // Create a temporary link element and trigger the download
  const link = document.createElement('a');
  link.href = fileURL;
  link.setAttribute('download', fileName); // Set the file name for download
  document.body.appendChild(link);
  link.click();

  // Clean up and remove the link element
  if (link?.parentNode) link.parentNode.removeChild(link);

  // Optional: Release the object URL
  URL.revokeObjectURL(fileURL);
};

export const orderBkData = (data) => {
  return orderBy(data, 'createdAt', 'desc');
};
