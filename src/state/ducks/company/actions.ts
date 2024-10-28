import { omit, pick } from 'lodash';
import qs from 'query-string';
import { generatePath } from 'react-router-dom';
import { GroupDocTypes, LCP, LCPDocRevOptions } from '../../../ui/administration/general.settings/panels/LCP/components/Grid/types';
import { getEmployeeNavigation } from '../../../ui/app/NavigationLocalStorageHelpers';
import { COMPANY_MINE_URL, COMPANY_SETTINGS_URL, CREATE_APPROVAL_ROLES_URL, LIFE_CYCLE_DOC_REV_OPTIONS_URL, LIFE_CYCLE_DOC_TYPES_URL, LIFE_CYCLE_PHASES_URL, UPDATE_APPROVAL_ROLES_URL, UPDATE_COMPANY_SETTINGS_URL } from '../../../ui/constants/urls';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, ApiActionMethod, Handlers } from '../../types';
import { DOC_TYPE_GROUP } from '../documentRevisions/documentType/types';
import { AUTOSAVE_CONFIG, REDLINE_CONFIG, SELECT_COMPANY, SET_AUTOSAVE_CONFIG, SET_COMPANY_MINE, SET_GENERAL_SETTINGS, UPDATE_NAVIGATION_ITEM } from './constants';
import { Company, CompanyMineAction, CompanyMineRequest, GeneralSettings, GeneralSettingsAction, GeneralSettingsState, NavigationMenu, SelectCompanyAction, UpdateNavigationMenuItem } from './types';

const selectCompany = (company: Company): SelectCompanyAction => ({
  type: SELECT_COMPANY,
  payload: company,
});

const setCompanyMine = (
  company: Company,
  navigationMenu?: NavigationMenu,
  currentEmployeeId?: string,
): CompanyMineAction => ({
  type: SET_COMPANY_MINE,
  payload: company,
  navigationMenu,
  currentEmployeeId,
});

const getCompanyMine = (currentEmployeeId: string, handlers: Handlers) =>
  apiActionWithCallbacks({
    url: COMPANY_MINE_URL,
    method: 'get',
    onSuccess: (data: any, dispatch) => {
      dispatch(setCompanyMine(data, getEmployeeNavigation(currentEmployeeId), currentEmployeeId));
    },
    handlers,
  });

const updateCompanyMine = (body: CompanyMineRequest, handlers: Handlers):
ApiAction<Company> => apiActionWithCallbacks({
  url: COMPANY_MINE_URL,
  method: 'patch',
  data: body,
  onSuccess: (data, dispatch) => {
    dispatch(setCompanyMine(data));
  },
  handlers,
});

const updateNavigationMenuItem = (label: string, isOpen: boolean): UpdateNavigationMenuItem => ({
  type: UPDATE_NAVIGATION_ITEM,
  payload: { label, isOpen },
});

const autosaveConfig = () => ({
  type: AUTOSAVE_CONFIG,
});

const setAutosaveConfig = (active: boolean) => ({
  type: SET_AUTOSAVE_CONFIG,
  payload: { active },
});

const redlineConfig = (redlineActive: boolean) => ({
  type: REDLINE_CONFIG,
  payload: { redlineActive },
});

const setGeneralSettings = (
  settings: GeneralSettingsState,
): GeneralSettingsAction => ({
  type: SET_GENERAL_SETTINGS,
  payload: settings,
});

const getGeneralSettings = (): ApiAction => apiAction({
  url: COMPANY_SETTINGS_URL,
  method: 'get',
  onSuccess: (data, dispatch) => {
    dispatch(setGeneralSettings(data));
  },
});

const updateGeneralSettings = (
  body: GeneralSettings,
  id?: string,
  method: ApiActionMethod = 'post',
): ApiAction<GeneralSettingsState> => {
  const { lifecyclePhases, ...rest } = body;
  const payload = { ...rest, lifecyclePhases: Array.isArray(lifecyclePhases) ? lifecyclePhases : [] };
  const url = id ? generatePath(UPDATE_COMPANY_SETTINGS_URL, { id }) : COMPANY_SETTINGS_URL;
  return apiAction({
    url,
    method,
    data: omit(payload, 'id', 'materialFlowACLs', 'approvalRoles'),
    asyncType: SET_GENERAL_SETTINGS,
    onSuccess: (data, dispatch) => {
      dispatch(setGeneralSettings(data));
    },
  });
};

const createApprovalRoles = (
  body: any,
  id?: string,
  method: ApiActionMethod = 'post',
): ApiAction<GeneralSettingsState> => {
  const { values } = body;
  const url = CREATE_APPROVAL_ROLES_URL;
  return apiAction({
    url,
    method,
    data: pick(values, 'name', 'isActive'),
    asyncType: SET_GENERAL_SETTINGS,
    onSuccess: (data, dispatch) => {
      dispatch(getGeneralSettings());
    },
  });
};

const updateApprovalRoles = (
  body: any,
  id?: string,
  method: ApiActionMethod = 'patch',
): ApiAction<GeneralSettingsState> => {
  const { lifecyclePhases, ...rest } = body;
  const payload = { ...rest, lifecyclePhases: Array.isArray(lifecyclePhases) ? lifecyclePhases : [] };
  const url = generatePath(UPDATE_APPROVAL_ROLES_URL, { id });
  return apiAction({
    url,
    method,
    data: pick(payload, 'isActive'),
    asyncType: SET_GENERAL_SETTINGS,
    onSuccess: (data, dispatch) => {
      dispatch(getGeneralSettings());
    },
  });
};

const fetchLCPPhasesByGroup = (
  type = DOC_TYPE_GROUP.PART,
  handlers: Handlers,
): ApiAction<LCP[]> =>
  apiActionWithCallbacks({
    url: `${LIFE_CYCLE_PHASES_URL}?group=${type}`,
    method: 'get',
    handlers,
  });

const fetchLCPDocTypes = (
  handlers: Handlers,
): ApiAction<GroupDocTypes[]> =>
  apiActionWithCallbacks({
    url: LIFE_CYCLE_DOC_TYPES_URL,
    method: 'get',
    handlers,
  });

const fetchDocRevOptionsByDocTypeId = (
  documentTypeId: string,
  currentPhaseId?: string,
  handlers: Handlers,
): ApiAction<LCPDocRevOptions[]> => {
  const params = qs.stringify({ documentTypeId, currentPhaseId });

  return apiActionWithCallbacks({
    url: `${LIFE_CYCLE_DOC_REV_OPTIONS_URL}?${params}`,
    method: 'get',
    handlers,
  });
};

export default {
  selectCompany,
  getCompanyMine,
  updateCompanyMine,
  updateNavigationMenuItem,
  autosaveConfig,
  fetchLCPDocTypes,
  fetchDocRevOptionsByDocTypeId,
  fetchLCPPhasesByGroup,
  setAutosaveConfig,
  redlineConfig,
  getGeneralSettings,
  updateGeneralSettings,
  createApprovalRoles,
  updateApprovalRoles,
};
