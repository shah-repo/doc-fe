export const HOME_URL = "/";
export const LOGIN_URL = "/login";
export const LOGIN_WITH_CODE_URL = "/auth/tokens";

export const DOCUMENT_CREATE_URL = "/document/create";

export const DOCUMENTS_LIST_URL = "/document";
export const DOCUMENT_ROOT_URL = `${DOCUMENTS_LIST_URL}/:documentId`;
export const DOCUMENT_UPDATE_URL = `${DOCUMENT_ROOT_URL}/update`;
export const DOCUMENT_PREVIEW_URL = `${DOCUMENT_ROOT_URL}/preview`;
export const DOCUMENT_CLONE_URL = `${DOCUMENT_ROOT_URL}/clone`;

export const CHANGE_REQUEST_CREATE_URL = "/change_request/create";

export const CHANGE_REQUEST_LIST_URL = "/change_request";
export const CHANGE_REQUEST_ROOT_URL = `${CHANGE_REQUEST_LIST_URL}/:changeRequestId`;
export const CHANGE_REQUEST_UPDATE_URL = `${CHANGE_REQUEST_ROOT_URL}/update`;
export const CHANGE_REQUEST_PREVIEW_URL = `${CHANGE_REQUEST_ROOT_URL}/preview`;

export const DOCUMENT_REVISION_CREATE_URL = "/document_revision/create";

export const DOCUMENT_REVISION_LIST_URL = "/document_revision";
export const DOCUMENT_REVISION_ROOT_URL = `${DOCUMENT_REVISION_LIST_URL}/:documentRevisionId`;
export const DOCUMENT_REVISION_UPDATE_URL = `${DOCUMENT_REVISION_ROOT_URL}/update`;
export const DOCUMENT_REVISION_PREVIEW_URL = `${DOCUMENT_REVISION_ROOT_URL}/preview`;

export const SIGNUP_URL = "/signup";
