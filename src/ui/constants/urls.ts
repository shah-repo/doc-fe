export const HOME_URL = "/";
export const LOGIN_URL = "/login";
export const LOGIN_WITH_CODE_URL = "/auth/tokens";

export const DOCUMENT_CREATE_URL = "/document/create";

export const CHANGE_REQUEST_CREATE_URL = "/change_request/:formId/create/:documentTypeId";

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
export const CONFIRM_FORGOT_PASSWORD_URL = "/sign_up/confirm_forgot_password/";
export const NEW_USER_SET_PASSWORD = "/new_user_set_password/";
export const STATUS = "/status";
export const MAINTENANCE = "/maintenance";

export const SUPPLIER_SURVEY_URL = "/supplier_survey/:token";

export const USER_MANAGEMENT_ROOT_URL = "/user_management";
export const USER_MANAGEMENT_DETAIL_URL = `${USER_MANAGEMENT_ROOT_URL}/:userId`;

export const SLACK_ROOT_URL = "/slack";
export const SLACK_COMPANY_URL = `${SLACK_ROOT_URL}/company`;
export const SLACK_USER_URL = `${SLACK_ROOT_URL}/user`;

export const DOCUMENT_BY_TYPE_ROOT_URL = "/document_by_type";
export const DOCUMENT_BY_TYPE_LIST_URL = `${DOCUMENT_BY_TYPE_ROOT_URL}/:docTypeId`;

export const DOCUMENT_BY_CATEGORY_ROOT_URL = "/document_by_category";
export const DOCUMENT_BY_CATEGORY_LIST_URL = `${DOCUMENT_BY_CATEGORY_ROOT_URL}/:categoryName`;

export const GROUP_MANAGEMENT_ROOT_URL = "/group_management";

export const TRAINING_URL = "/training"

export const COMPANY_MINE_URL = "/company/mine";
