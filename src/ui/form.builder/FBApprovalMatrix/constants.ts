import { optionMapper } from './components/Grid';
import { translate } from '../../../common/intl';

export const APPROVAL_MATRIX_URL = '/document_type/approval_matrix';
export const PO_APPROVAL_MATRIX_URL = '/purchase_order/approval_matrix';

export const CATEGORY_OPTIONS = [
  optionMapper('', translate('navigation.document.list')),
  optionMapper('Approval Request'),
  optionMapper('Record'),
  optionMapper('Equipment'),
  optionMapper('Supplier'),
  optionMapper('Purchase Order'),
  optionMapper('Receive'),
  optionMapper('Parts'),
  optionMapper('EB'),
  optionMapper('Lhr'),
  optionMapper('Lot'),
  optionMapper('Training Records'),
  optionMapper('Training Curriculums'),
  optionMapper('Hidden'),
];
