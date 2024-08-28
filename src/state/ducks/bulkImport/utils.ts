import axiosApi from '../../../App/Shifamed/API/axiosConfig';
import { approvalFieldId, APPROVALS_URL, BULK_DOWNLOAD_FILE_URL, DOCUMENT_REVISION_IN_REVIEW_URL, DOCUMENT_REVISION_URL, documentRevisionFormInput } from './constants';

const TEMPLATE_CSV = 'template.xlsx';

export const getDownloadTemplate = async (bulkImportId: string) => {
  try {
    const response = await axiosApi.get(`${BULK_DOWNLOAD_FILE_URL}${bulkImportId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', TEMPLATE_CSV);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Failed to download template:', error);
  }
};

export const postApprovals = async (approvalId, documentRevisionId) => {
  try {
    const response = await axiosApi.post(APPROVALS_URL, {
      assigned: {
        id: approvalId,
      },
      type: 'MASTER',
      fieldId: approvalFieldId,
      partOf: {
        id: documentRevisionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post approvals:', error);
    return null;
  }
};

export const patchDocumentRevisions = async (approvalId, documentRevisionId) => {
  try {
    const response = await axiosApi.patch(`${DOCUMENT_REVISION_URL}${documentRevisionId}`, {
      formInput: {
        [documentRevisionFormInput]: [approvalId],
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to save document revisions:', error);
    return null;
  }
};

export const postDocumentRevisionsInReview = async (documentRevisionId) => {
  try {
    const response = await axiosApi.post(`${DOCUMENT_REVISION_IN_REVIEW_URL}${documentRevisionId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to save document revisions in review:', error);
    return null;
  }
};

export const downloadFile = (data: BlobPart, fileName: string) => {
  const file = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileURL = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = fileURL;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  if (link?.parentNode) link.parentNode.removeChild(link);
  URL.revokeObjectURL(fileURL);
};
