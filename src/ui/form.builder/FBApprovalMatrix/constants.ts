import { translate } from '../../../common/intl';
import { createOption } from './components/Grid';

export const APPROVAL_MATRIX_URL = '/document_type/approval_matrix';
export const PO_APPROVAL_MATRIX_URL = '/purchase_order/approval_matrix';

export const DEFAULT_CATEGORY_LABEL = translate('navigation.document.list');

export const CATEGORY_OPTIONS = [
  createOption(DEFAULT_CATEGORY_LABEL),
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
  createOption('Training Curriculums'),
  createOption('Hidden'),
];
