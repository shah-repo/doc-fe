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
