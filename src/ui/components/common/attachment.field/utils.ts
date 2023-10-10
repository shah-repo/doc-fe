import { intl } from '../../../../common/intl';
import { toastError } from '../../notifications';

export const FILE_UPLOAD_LIMIT = 4 * 1024 * 1024 * 1024;

const fileSize = (filesSize: number) => {
  const i = Math.floor(Math.log(filesSize) / Math.log(1024));
  return `${(filesSize / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

const LIMIT = fileSize(FILE_UPLOAD_LIMIT);

export const handleFileSizeExceedLimit = (names: string[], filesSize: number, event: React.FormEvent<HTMLInputElement>) => {
  const formattedSize = fileSize(filesSize);
  event.currentTarget.value = '';
  const errorMessages = names.map(name => {
    return toastError(
      intl.formatMessage(
        { id: 'common.attachment.exceeds.size.error' },
        { name, size: formattedSize, limit: LIMIT },
      ),
    );
  });
  return errorMessages;
};
