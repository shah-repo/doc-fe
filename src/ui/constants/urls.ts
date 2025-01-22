export const HOME_URL = '/';
export const DASHBOARD_URL = '/dashboard';
export const LOGIN_URL = '/login';
export const LOGIN_WITH_CODE_URL = '/auth/tokens';

export const CHANGE_REQUEST_CREATE_URL = '/change_request/:formId/create/:documentTypeId';

export const CHANGE_REQUEST_LIST_URL = '/change_request';
export const CHANGE_REQUEST_ROOT_URL = `${CHANGE_REQUEST_LIST_URL}/:changeRequestId`;
export const CHANGE_REQUEST_UPDATE_URL = `${CHANGE_REQUEST_ROOT_URL}/update`;
export const CHANGE_REQUEST_EDIT_URL = `${CHANGE_REQUEST_ROOT_URL}/edit`;
export const CHANGE_REQUEST_PREVIEW_URL = `${CHANGE_REQUEST_ROOT_URL}/preview`;

export const DOCUMENT_REVISION_CREATE_URL = '/document_revision/create';

export const DOCUMENT_REVISION_LIST_URL = '/document_revision';
export const DOCUMENT_REVISION_ROOT_URL = `${DOCUMENT_REVISION_LIST_URL}/:documentId`;
export const DOCUMENT_REVISION_DETAILS_URL = `${DOCUMENT_REVISION_ROOT_URL}/details`;
export const DOCUMENT_REVISION_VERSION_URL = `${DOCUMENT_REVISION_ROOT_URL}/version/:documentRevisionId`;
export const DOCUMENT_REVISION_NEW_VERSION_URL = `${DOCUMENT_REVISION_ROOT_URL}/new-version/:documentRevisionId`;
export const DOCUMENT_REVISION_OUTPUT_URL = `${DOCUMENT_REVISION_ROOT_URL}/output_document/:documentRevisionId`;

export const TRAINING_URL = '/training';
export const TRAINING_DETAIL_URL = `${TRAINING_URL}/detail/:trainingId`;

export const SIGNUP_URL = '/signup';
export const CONFIRM_FORGOT_PASSWORD_URL = '/sign_up/confirm_forgot_password/';
export const NEW_USER_SET_PASSWORD = '/new_user_set_password/';
export const RESET_PASSWORD_URL = '/reset_password/';
export const RESET_PASSWORD_SUCCESSFUL_URL = '/reset_password_successful/';

export const STATUS = '/status';
export const MAINTENANCE = '/maintenance';
export const USER_LOCKED = '/locked';
export const NO_ACCESS = '/no-access';
export const EXPORTED_FILE_DOWNLOAD = '/exported_file_download';

export const SUPPLIER_SURVEY_URL = '/supplier_survey/:token';

export const SLACK_ROOT_URL = '/slack';
export const SLACK_COMPANY_URL = `${SLACK_ROOT_URL}/company`;
export const SLACK_USER_URL = `${SLACK_ROOT_URL}/user`;

const DOCUMENT_BY_TYPE_ROOT_URL = '/document_by_type';
export const DOCUMENT_BY_TYPE_LIST_URL = `${DOCUMENT_BY_TYPE_ROOT_URL}/:docTypeId`;
export const DOCUMENT_TYPE_MANAGEMENT_URL = '/document_type_management';

export const DOCUMENT_BY_CATEGORY_ROOT_URL = '/document_by_category';
export const DOCUMENT_BY_CATEGORY_LIST_URL = `${DOCUMENT_BY_CATEGORY_ROOT_URL}/:categoryName`;

export const COMPANY_MINE_URL = '/company/mine';

export const PAGE_DETAILS_MANAGEMENT_URL = '/page_details_management';

export const ASYNC_TASKS_URL = '/async_tasks';

export const COMPANY_EMAIL = 'enlil-feedback@shifamed.com';

export const GLOBAL_SEARCH_URL = '/search';

export const GENERAL_SETTINGS_URL = '/general_settings';

export const PREMIUM_FEATURES_URL = '/premium_feature';

export const USER_GROUP_URL = '/user_group';
export const USER_GROUPS_URL = '/user_group/group';

export const COMPANY_SETTINGS_URL = '/company/settings';

export const SUBSCRIPTIONS_URL = '/company/subscriptions';

export const UPDATE_COMPANY_SETTINGS_URL = '/company/settings/:id';

export const BULK_IMPORT_URL = '/bulk_import/create';

export const BULK_IMPORT_PROGRESS_URL = '/bulk_import';

export const LIFE_CYCLE_URL = '/lifecycle';
export const LIFE_CYCLE_PHASES_URL = `${COMPANY_SETTINGS_URL}${LIFE_CYCLE_URL}/baseOptions`;
export const LIFE_CYCLE_DOC_REV_OPTIONS_URL = `${COMPANY_SETTINGS_URL}${LIFE_CYCLE_URL}/docRevOptions`;
export const LIFE_CYCLE_DOC_TYPES_URL = `${COMPANY_SETTINGS_URL}${LIFE_CYCLE_URL}/documentTypeOptions`;
