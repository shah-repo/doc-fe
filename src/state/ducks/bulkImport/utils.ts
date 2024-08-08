import axios from 'axios';
import Config from '../../../config';
import { store } from '../../store';
import { BULK_DOWNLOAD_FILE_URL } from './constants';

const TEMPLATE_CSV = 'template.xlsx';

export const getDownloadTemplate = async (bulkImportId: string) => await axios({
  url: `${Config.ApiEndpoint}${BULK_DOWNLOAD_FILE_URL}${bulkImportId}`,
  method: 'GET',
  responseType: 'blob',
  headers: {
    Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
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
