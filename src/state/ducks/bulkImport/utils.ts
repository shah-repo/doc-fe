import axios from 'axios';
import { isEmpty, orderBy } from 'lodash';
import { translate } from '../../../common/intl';
import Config from '../../../config';
import { iconStatuses } from '../../../ui/bulkImport/components/ProgressSection/ProgressIcons';
import { ApprovalStatus } from '../common/types';
import { APPROVALS_URL, BULK_DOWNLOAD_FILE_URL, BULK_IMPORT_URL, DOCUMENT_REVISION_IN_REVIEW_URL, DOCUMENT_REVISION_URL, DOCUMENT_REVISION_WITHDRAWN_URL, skippedAttachmentFile } from './constants';
import { BkIconStatus, BkStatus, BulkImport, BulkImportCustom } from './types';

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

export const getBulkImportCustomData = (bulkImport: BulkImport): BulkImportCustom => {
  const progress = bulkImport?.process?.process
    ? bulkImport.process.process.filter(p => p.status === BkStatus.COMPLETED)
      .reduce((total, current) => total + (current.percentage * 100), 0) : 0;
  const approvalCheck = bulkImport?.documentRevision?.approvals?.some(approval => approval.status !== ApprovalStatus.Abandoned) ?? false;

  const icons = [
    {
      icon: bulkImport?.xlsx?.length > 0 ? BkIconStatus.check : BkIconStatus.blank,
      text: translate('bulkImport.uploadData'),
      step: 1,
    },
    { // we valid if the next step is already done "attachmentId" because process.step can be deleted on Bulk import process after the approve
      icon: bulkImport?.attachmentId || Number(bulkImport.process?.step) <= 3 ? BkIconStatus.check : Number(bulkImport.process?.totalExcelErrors ?? 0) >= 1 ? BkIconStatus.warning : BkIconStatus.blank,
      text: translate('bulkImport.mapColumns'),
      step: 2,
    },
    {
      icon: bulkImport?.attachmentId || (bulkImport?.attachmentLink && bulkImport?.attachmentLink !== skippedAttachmentFile) ? BkIconStatus.check : approvalCheck || bulkImport.attachmentLink === skippedAttachmentFile ? BkIconStatus.skip : BkIconStatus.blank,
      text: translate('common.attachments'),
      step: 3,
    },
    {
      icon: approvalCheck && bulkImport?.status !== BkStatus.CANCELLED ? BkIconStatus.check : BkIconStatus.blank,
      text: translate('bulkImport.approvals'),
      step: 4,
    },
    {
      icon: !isEmpty(bulkImport.process?.process) && progress > 99 && bulkImport?.status !== BkStatus.CANCELLED ? BkIconStatus.check : BkIconStatus.blank,
      text: translate('bulkImport.importing'),
      step: 5,
    },
  ];

  // Set the current step
  let currentProgressStep = 0;

  const firstBlankIcon = icons.find(icon => (!iconStatuses[icon.icon] || icon.icon === BkIconStatus.warning || icon.icon === BkIconStatus.blank));
  if (firstBlankIcon) {
    currentProgressStep = firstBlankIcon.step;
  }
  if ((bulkImport?.documentRevision?.approvals
    && bulkImport.documentRevision.approvals.some(approval => approval.status === ApprovalStatus.Pending)
    && bulkImport.documentRevision.approvals.some(approval => approval.status !== ApprovalStatus.Approved))) {
    // if we don't find any blank icon is because we already finish and is on the last step
    currentProgressStep = 4; // approver step
  }
  if (!isEmpty(bulkImport.process?.process) || bulkImport.status === BkStatus.IN_PROGRESS) {
    currentProgressStep = 5; // importing step
  } else if (currentProgressStep === 5) {
    currentProgressStep = 4; // approver step
  }

  // Create the custom bulk import
  return {
    ...bulkImport,
    progress,
    icons,
    currentProgressStep,
  };
};
