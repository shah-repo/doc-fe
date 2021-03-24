import { combineReducers } from "redux";
import { setNavigation } from "../../../ui/app/NavigationLocalStorageHelpers";
import { ThemeEnv } from "../../../ui/layout/theme/utils/types";
import { LOGOUT_USER } from "../auth/constants";
import { LogoutUserAction } from "../auth/types";
import { AUTOSAVE_CONFIG, DEFAULT_NAVIGATION_ITEMS, REDLINE_CONFIG, SELECT_COMPANY, SET_COMPANY_MINE, UPDATE_NAVIGATION_ITEM, WHITE_LABEL_DEFAULT } from "./constants";
import { AutosaveAction, AutosaveState, CompanyMineAction, RedlineAction, RedlineState, SelectCompanyAction, SelectCompanyState, UpdateNavigationMenuItem } from "./types";

export const COMPANY_DEFAULT_STATE: SelectCompanyState = {
  id: "",
  name: "",
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
  helloSignAppId: "",
  teamId: "",
  addresses: [],
  acctCodes: [],
  helloSignIntegrationEnabled: false,
  navigation: DEFAULT_NAVIGATION_ITEMS,
};

const AUTOSAVE_DEFAULT_STATE = {
  autosaveEnabled: true,
};

const REDLINE_DEFAULT_STATE = {
  redlineActive: false,
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
        const menuItems = action.payload.navigation.filter((item) => item.type === "MENU");
        const menus = menuItems.map((item) => ({ label: item.label, isOpen: false }));
        setNavigation(action.currentEmployeeId || "", { id: action.currentEmployeeId, menus });
      }

      action.payload.navigation = action.payload.navigation.map((item) => {
        if (item.type === "MENU") {
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
  action: AutosaveAction | LogoutUserAction,
): AutosaveState => {
  switch (action.type) {
    case AUTOSAVE_CONFIG:
      return {
        autosaveEnabled: !state.autosaveEnabled,
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
        redlineActive: !state.redlineActive,
      };
    case LOGOUT_USER:
      return REDLINE_DEFAULT_STATE;
    default:
      return state;
  }
};

export default combineReducers({
  selectedCompany,
  companyMine,
  autosaveConfig,
  redlineConfig,
});
