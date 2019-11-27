export const HOME_URL = "/";
export const LOGIN_URL = "/login";
export const LOGIN_WITH_CODE_URL = "/auth/tokens";

export const DOCUMENT_CREATE_URL = "/document/create";

export const CHANGE_REQUEST_CREATE_URL = "/change_request/create";

export const CHANGE_REQUEST_LIST_URL = "/change_request";
export const CHANGE_REQUEST_ROOT_URL = `${CHANGE_REQUEST_LIST_URL}/:changeRequestId`;
export const CHANGE_REQUEST_UPDATE_URL = `${CHANGE_REQUEST_ROOT_URL}/update`;
export const CHANGE_REQUEST_PREVIEW_URL = `${CHANGE_REQUEST_ROOT_URL}/preview`;

export const DOCUMENT_REVISION_CREATE_URL = "/document_revision/create";

export const DOCUMENT_REVISION_LIST_URL = "/document_revision";
export const DOCUMENT_REVISION_ROOT_URL = `${DOCUMENT_REVISION_LIST_URL}/:documentId`;
export const DOCUMENT_REVISION_DETAILS_URL = `${DOCUMENT_REVISION_ROOT_URL}/details`;
export const DOCUMENT_REVISION_VERSION_URL = `${DOCUMENT_REVISION_ROOT_URL}/version/:documentRevisionId`;
export const DOCUMENT_REVISION_NEW_VERSION_URL = `${DOCUMENT_REVISION_ROOT_URL}/new-version/:documentRevisionId`;
export const DOCUMENT_REVISION_OUTPUT_URL = `${DOCUMENT_REVISION_ROOT_URL}/output_document/:documentRevisionId`;

export const FORM_BUILDER_URL = "/form_builder";

export const TRAINING_ROOT_URL = "/training";
export const TRAINING_DETAIL_URL = `${TRAINING_ROOT_URL}/detail/:trainingId`;

export const SIGNUP_URL = "/signup";
export const STATUS = "/status";

export const SUPPLIER_SURVEY_URL = "/supplier_survey/:token";
