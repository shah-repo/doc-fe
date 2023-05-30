import { createOption } from './components/Grid';
import { translate } from '../../../common/intl';

export const APPROVAL_MATRIX_URL = '/document_type/approval_matrix';
export const PO_APPROVAL_MATRIX_URL = '/purchase_order/approval_matrix';

export const CATEGORY_OPTIONS = [
  createOption('', translate('navigation.document.list')),
  createOption('Approval Request'),
  createOption('Record'),
  createOption('Equipment'),
  createOption('Supplier'),
  createOption('Purchase Order'),
  createOption('Receive'),
  createOption('Parts'),
  createOption('EB'),
  createOption('Lhr'),
  createOption('Lot'),
  createOption('Training Records'),
  createOption('Training Curriculums'),
  createOption('Hidden'),
];
