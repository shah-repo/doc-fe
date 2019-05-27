export const HOME_URL = "/";
export const LOGIN_URL = "/login";
export const LOGIN_WITH_CODE_URL = "/auth/tokens";

export const DOCUMENT_CREATE_URL = "/document/create";

export const DOCUMENTS_LIST_URL = "/document";
export const DOCUMENT_ROOT_URL = `${DOCUMENTS_LIST_URL}/:documentId`;
export const DOCUMENT_UPDATE_URL = `${DOCUMENT_ROOT_URL}/update`;
export const DOCUMENT_PREVIEW_URL = `${DOCUMENT_ROOT_URL}/preview`;
export const DOCUMENT_CLONE_URL = `${DOCUMENT_ROOT_URL}/clone`;

export const SIGNUP_URL = "/signup";
