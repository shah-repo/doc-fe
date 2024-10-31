import { combineReducers } from 'redux';
import { setNavigation } from '../../../ui/app/NavigationLocalStorageHelpers';
import { ThemeEnv } from '../../../ui/layout/theme/utils/types';
import { AsyncStatus } from '../../types';
import { LOGOUT_USER } from '../auth/constants';
import { LogoutUserAction } from '../auth/types';
import { AUTOSAVE_CONFIG, DEFAULT_NAVIGATION_ITEMS, REDLINE_CONFIG, SELECT_COMPANY, SET_AUTOSAVE_CONFIG, SET_COMPANY_MINE, SET_GENERAL_SETTINGS, UPDATE_NAVIGATION_ITEM, WHITE_LABEL_DEFAULT } from './constants';
import { AllocationOrder, AutosaveAction, AutosaveState, CompanyMineAction, ExpiredLotTypes, GeneralSettingsAction, GeneralSettingsState, NotifyPartLCP, RedlineAction, RedlineState, SelectCompanyAction, SelectCompanyState, SetAutosaveAction, UpdateNavigationMenuItem } from './types';

export const COMPANY_DEFAULT_STATE: SelectCompanyState = {
  id: '',
  name: '',
  numOfRevStages: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: {
    [ThemeEnv.DEV_THEME]: WHITE_LABEL_DEFAULT,
    [ThemeEnv.DEMO_THEME]: WHITE_LABEL_DEFAULT,
    [ThemeEnv.SANDBOX_THEME]: WHITE_LABEL_DEFAULT,
    [ThemeEnv.PRODUCTION_THEME]: WHITE_LABEL_DEFAULT,
  },
  slackIntegrationEnabled: false,
  helloSignAppId: '',
  teamId: '',
  addresses: [],
  locations: [],
  acctCodes: [],
  helloSignIntegrationEnabled: false,
  navigation: DEFAULT_NAVIGATION_ITEMS,
  scheduledForDeletion: false,
};

const AUTOSAVE_DEFAULT_STATE = {
  autosaveEnabled: true,
};

const REDLINE_DEFAULT_STATE = {
  redlineActive: false,
};

const GENERAL_SETTINGS_DEFAULT_STATE: GeneralSettingsState = {
  allocationConfig: {
    sortOrderByReleaseDate: AllocationOrder.FIFO,
    expiredLotsPrompt: ExpiredLotTypes.WARNING,
  },
  approvalRequestAdmin: false,
  equipmentFamily: {
    autoSyncEnabled: false,
    locations: [],
    equipmentStatuses: [],
  },
  isMaterialFlowAclEnabled: false,
  lifecyclePhases: { categories: [] },
  materialFlowACLs: [],
  shouldAutoUpdateLotStatus: false,
  shouldNotifyLcpMismatch: NotifyPartLCP.DO_NOTHING,
  systemTransactions: [],
  zebraPrint: [],
  status: AsyncStatus.Idle,
  message: '',
  trainingReminders: {
    customDaysDueOn: { isActive: false, days: 14, isCcActive: false },
    isSevenDaysDueOnCountdownActive: true,
    isAssignedActive: true,
    isOverdueActive: true,
    isAssignedCcActive: false,
    isSevenDaysDueOnCountdownCcActive: false,
    isOverdueCcActive: false,
  },
};

type CompanyActions = SelectCompanyAction | LogoutUserAction;

const selectedCompany = (
  state: SelectCompanyState = COMPANY_DEFAULT_STATE,
  action: CompanyActions,
): SelectCompanyState => {
  switch (action.type) {
    case SELECT_COMPANY:
      return {
        ...action.payload,
        navigation:
          action.payload.navigation?.length
            ? action.payload.navigation
            : DEFAULT_NAVIGATION_ITEMS,
      };
    case LOGOUT_USER:
      return { ...COMPANY_DEFAULT_STATE };
    default:
      return state;
  }
};

const companyMine = (
  state: SelectCompanyState = COMPANY_DEFAULT_STATE,
  action: CompanyMineAction | UpdateNavigationMenuItem,
): SelectCompanyState => {
  switch (action.type) {
    case SET_COMPANY_MINE:
      if (!action.payload.navigation?.length) {
        action.payload.navigation = DEFAULT_NAVIGATION_ITEMS;
      }
      if (!action.navigationMenu) {
        const menuItems = action.payload.navigation.filter((item) => item.type === 'MENU');
        const menus = menuItems.map((item) => ({ label: item.label, isOpen: false }));
        setNavigation(action.currentEmployeeId || '', { id: action.currentEmployeeId, menus });
      }

      action.payload.navigation = action.payload.navigation.map((item) => {
        if (item.type === 'MENU') {
          const match = action?.navigationMenu?.menus.find((menu) => menu.label === item.label);
          if (match) {
            return { ...item, isOpen: match.isOpen };
          }
          return { ...item, isOpen: false };
        }
        return item;
      });

      return {
        ...action.payload,
      };
    case UPDATE_NAVIGATION_ITEM:
      return {
        ...state,
        navigation: state.navigation.map((item) => {
          if (item.label === action.payload.label) {
            return ({ ...item, isOpen: action.payload.isOpen });
          }
          return item;
        }),
      };

    default:
      return state;
  }
};

const autosaveConfig = (
  state: AutosaveState = AUTOSAVE_DEFAULT_STATE,
  action: AutosaveAction | SetAutosaveAction | LogoutUserAction,
): AutosaveState => {
  switch (action.type) {
    case AUTOSAVE_CONFIG:
      return {
        autosaveEnabled: !state.autosaveEnabled,
      };
    case SET_AUTOSAVE_CONFIG:
      return {
        autosaveEnabled: action.payload.active,
      };
    case LOGOUT_USER:
      return AUTOSAVE_DEFAULT_STATE;
    default:
      return state;
  }
};

const redlineConfig = (
  state: RedlineState = REDLINE_DEFAULT_STATE,
  action: RedlineAction | LogoutUserAction,
): RedlineState => {
  switch (action.type) {
    case REDLINE_CONFIG:
      return {
        redlineActive: action.payload.redlineActive,
      };
    case LOGOUT_USER:
      return REDLINE_DEFAULT_STATE;
    default:
      return state;
  }
};

const generalSettings = (
  state: GeneralSettingsState = GENERAL_SETTINGS_DEFAULT_STATE,
  action: GeneralSettingsAction,
) => {
  switch (action.type) {
    case SET_GENERAL_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  selectedCompany,
  companyMine,
  redlineConfig,
  autosaveConfig,
  generalSettings,
});
