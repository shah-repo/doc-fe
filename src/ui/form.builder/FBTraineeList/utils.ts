import { translate } from '../../../common/intl';
import { DocumentOption } from './types';

export const getOptionLabel = ({ docId, displayRevision }: DocumentOption): string => {
  return translate('common.displayRevision', { docId, displayRevision });
};
