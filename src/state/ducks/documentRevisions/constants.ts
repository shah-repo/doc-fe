export const DOCUMENT_REVISION_SET = 'documentRevisions/SET';
export const DOCUMENT_REVISION_LIST = 'documentRevisions/LIST';
export const DOCUMENT_REVISION_AUDIT_SET = 'documentRevisions/AUDIT_SET';

export const DOCUMENT_REVISION_GET_ASYNC = 'documentRevisions/GET_ASYNC';
export const DOCUMENT_REVISION_GET_ASYNC_DRAWER = 'documentRevisions/GET_ASYNC_DRAWER';
export const DOCUMENT_REVISION_SECURITY_GET_ASYNC = 'documentRevisions/GET_ASYNC_SECURITY';
export const DOCUMENT_REVISION_LIST_ASYNC = 'documentRevisions/LIST_ASYNC';
export const DOCUMENT_REVISION_GET_AUDIT_ASYNC = 'documentRevisions/GET_AUDIT_ASYNC';

export const DOCUMENT_GET_ASYNC = 'documentRevisions/GET_DOCUMENT_ASYNC';
export const DOCUMENT_SET = 'documentRevisions/SET_DOCUMENT';

export const DOCUMENT_REVISION_ROOT_URL = '/document_revisions';
export const DOCUMENT_REVISION_SEARCH_ROOT_URL = '/document_revisions/search';

export const DOCUMENT_ROOT_URL = '/documents';
export const DOCUMENT_REVISION_UPGRADE_URL = `${DOCUMENT_REVISION_ROOT_URL}/upgradeToReleasedForm`;

export const DOCUMENT_REVISION_FORMS_URL = `${DOCUMENT_REVISION_ROOT_URL}/forms_group_option`;
export const DOCUMENT_REVISION_FAI_INSPECTION_URL = `${DOCUMENT_REVISION_ROOT_URL}/fai_inspection`;
export const DOCUMENT_REVISION_PARTS_URL = `${DOCUMENT_REVISION_ROOT_URL}/available_parts`;

export const FETCH_BOM_TREE = 'bom/parent_tree';
export const FETCH_BOM_BRANCH = 'bom/branch/details';
export const ADD_BOM_BRANCH = 'bom/branch';
export const UPDATE_BOM_BRANCH = 'bom/branch';
export const DELETE_BOM_BRANCH = 'bom/branch';
export const CHANGE_ORDER_BOM_BRANCH = 'bom/change_order';
export const FETCH_WHERE_USED_TREE = 'bom/where_used';
export const CHECK_IS_USED = 'bom/where_used_status';

export const FETCH_ALTERNATE_PART = 'bom/alternate_part';
export const ADD_ALTERNATE_PART = 'bom/alternate_part';
export const DELETE_ALTERNATE_PART = 'bom/alternate_part';

export const FETCH_VENDORS = 'bom/supplier_list';

export const PO_REQUESTOR_COMPONENT_NAME = 'po-requestor-autocomplete';
export const PO_ITEMS_COMPONENT_NAME = 'po-items-built-in';
export const PO_APPROVAL_KEY = 'fb-po-approvals-';
export const THRESHOLD_KEY = 'threshold';
export const PO_ROOT_URL = '/purchase_order';
export const LOT_ROOT_URL = '/lot';
export const EQUIPMENT_ROOT_URL = '/equipment';
