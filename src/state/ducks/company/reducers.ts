import { combineReducers } from "redux";
import { setNavigation } from "../../../ui/app/NavigationLocalStorageHelpers";
import { LOGOUT_USER } from "../auth/constants";
import { LogoutUserAction } from "../auth/types";
import { DEFAULT_NAVIGATION_ITEMS, SELECT_COMPANY, SET_COMPANY_MINE, UPDATE_NAVIGATION_ITEM, WHITE_LABEL_DEFAULT } from "./constants";
import { CompanyMineAction, SelectCompanyAction, SelectCompanyState, UpdateNavigationMenuItem } from "./types";

export const COMPANY_DEFAULT_STATE: SelectCompanyState = {
  id: "",
  name: "",
  numOfRevStages: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: WHITE_LABEL_DEFAULT,
  slackIntegrationEnabled: false,
  helloSignAppId: "",
  teamId: "",
  addresses: [],
  acctCodes: [],
  helloSignIntegrationEnabled: false,
  navigation: DEFAULT_NAVIGATION_ITEMS,
};

type CompanyActions = SelectCompanyAction | LogoutUserAction;

export const selectedCompany = (
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

export const companyMine = (
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

export default combineReducers({
  selectedCompany,
  companyMine,
});
