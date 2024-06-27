import { isEmpty, omit } from 'lodash';
import { generatePath } from 'react-router-dom';
import { getEmployeeNavigation } from '../../../ui/app/NavigationLocalStorageHelpers';
import { COMPANY_MINE_URL, COMPANY_SETTINGS_URL, UPDATE_COMPANY_SETTINGS_URL } from '../../../ui/constants/urls';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, ApiActionMethod, Handlers } from '../../types';
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

const updateGeneralSettings = (body: GeneralSettings, id = '', method: ApiActionMethod = 'post'): ApiAction<GeneralSettingsState> => apiAction({
  url: !isEmpty(id) ? generatePath(UPDATE_COMPANY_SETTINGS_URL, { id: id }) : COMPANY_SETTINGS_URL,
  method: method,
  data: omit(body, 'id'),
  asyncType: SET_GENERAL_SETTINGS,
  onSuccess: (data, dispatch) => {
    dispatch(setGeneralSettings(data));
  },
});

export default {
  selectCompany,
  getCompanyMine,
  updateCompanyMine,
  updateNavigationMenuItem,
  autosaveConfig,
  setAutosaveConfig,
  redlineConfig,
  getGeneralSettings,
  updateGeneralSettings,
};
