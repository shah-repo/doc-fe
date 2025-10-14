import { intl } from '../../../../common/intl';
import { toastError } from '../../notifications';

const FILE_UPLOAD_LIMIT = 4 * 1024 * 1024 * 1024; // 4GB

const fileSize = (filesSize: number) => {
  const i = Math.floor(Math.log(filesSize) / Math.log(1024));
  return `${(filesSize / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

const toastFileSizeExceedLimitError = (
  file: File,
  sizeLimit: number,
): void => {
  toastError(
    intl.formatMessage(
      { id: 'common.attachment.exceeds.size.error' },
      { name: file.name, size: fileSize(file.size), limit: fileSize(sizeLimit) },
    ),
  );
};

export const getValidSizedFiles = <T extends File[] | FileList>(
  files: T,
  sizeLimit: number = FILE_UPLOAD_LIMIT,
  onError = toastFileSizeExceedLimitError,
): File[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => {
    if (file.size > sizeLimit) {
      onError(file, sizeLimit);
      return false;
    }
    return true;
  });
};
