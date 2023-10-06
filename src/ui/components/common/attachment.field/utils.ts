import { intl } from '../../../../common/intl';
import { toastError } from '../../notifications';

export const handleFileSizeExceedLimit = (filesSize: number, event: React.FormEvent<HTMLInputElement>) => {
  const i = Math.floor(Math.log(filesSize) / Math.log(1024));
  const formattedSize = `${(filesSize / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
  event.currentTarget.value = '';
  const fileSizeExceedLimitMessage: string = toastError(intl.formatMessage({ id: 'common.attachment.exceeds.size.error' }, { filesSize: formattedSize }));
  return fileSizeExceedLimitMessage;
};

export const FILE_UPLOAD_LIMIT = 4 * 1024 * 1024 * 1024;
