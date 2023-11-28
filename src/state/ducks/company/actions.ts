import { omit } from 'lodash';
import { generatePath } from 'react-router-dom';
import { getEmployeeNavigation } from '../../../ui/app/NavigationLocalStorageHelpers';
import { COMPANY_MINE_URL, COMPANY_SETTINGS_URL, UPDATE_COMPANY_SETTINGS_URL } from '../../../ui/constants/urls';
import { apiAction, apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { AUTOSAVE_CONFIG, REDLINE_CONFIG, SELECT_COMPANY, SET_COMPANY_MINE, SET_GENERAL_SETTINGS, UPDATE_NAVIGATION_ITEM } from './constants';
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
    console.log('--data---', { data });
    data = {
      createdAt: '2023-10-11T12:06:51.419Z',
      updatedAt: '2023-10-26T10:36:36.686Z',
      id: '238bf130-f652-43b7-970d-a83f8b807349',
      companyId: 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
      zebraPrint: [
          {
            apiKey: '1111C0focWIzjJFEL2Yai3VioUNGYvEeCBXN',
          printer:
              {
labelTemplates: [{ id: 'Type1', name: 'Type 1, 3.4" x 1"' }, { id: 'Type2', name: 'Type 2, 4" x 2"' }],
                  sn: '111111111',
                  isActive: true,
                  name: '1111'
              },
          tenantId: 'bb42c8d2b03adda0adf0b1c0029ceffd'
        },
          {
            apiKey: '2222C0focWIzjJFEL2Yai3VioUNGYvEeCBXN',
          printer:
              {
labelTemplates: [{ id: 'Type1', name: 'Type 1, 3.4" x 1"' }, { id: 'Type2', name: 'Type 2, 4" x 2"' }],
                  'sn': '22222222',
                  'isActive': true,
                  name: '22222 testing name er ere r ere reeeaaa'
              },
          tenantId: 'bb42c8d2b03adda0adf0b1c0029ceffd'
        },
        ],
      approvalRequestAdmin: true, shouldAutoUpdateLotStatus: false
  };
    dispatch(setGeneralSettings(data));
  },
});

const updateGeneralSettings = (body: GeneralSettings, id: string, method = 'post'): ApiAction<GeneralSettingsState> => apiAction({
  url: id ? generatePath(UPDATE_COMPANY_SETTINGS_URL, { id: id }) : COMPANY_SETTINGS_URL,
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
  redlineConfig,
  getGeneralSettings,
  updateGeneralSettings,
};
