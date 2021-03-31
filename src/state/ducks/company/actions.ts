import { getEmployeeNavigation } from "../../../ui/app/NavigationLocalStorageHelpers";
import { COMPANY_MINE_URL } from "../../../ui/constants/urls";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { AUTOSAVE_CONFIG, ENABLE_COMPANY_DROPBOX, REDLINE_CONFIG, SELECT_COMPANY, SET_COMPANY_MINE, UPDATE_NAVIGATION_ITEM } from "./constants";
import { Company, CompanyMineAction, CompanyMineRequest, NavigationMenu, SelectCompanyAction, UpdateNavigationMenuItem } from "./types";

const selectCompany = (company: Company): SelectCompanyAction => ({
  type: SELECT_COMPANY,
  payload: company,
});

const setCompanyMine = (
  company: Company,
  navigationMenu?: NavigationMenu,
  currentEmployeeId?: string
): CompanyMineAction => ({
  type: SET_COMPANY_MINE,
  payload: company,
  navigationMenu,
  currentEmployeeId,
});

const getCompanyMine = (currentEmployeeId: string, handlers: Handlers) =>
  apiActionWithCallbacks({
    url: COMPANY_MINE_URL,
    method: "get",
    onSuccess: (data: any, dispatch) => {
      dispatch(setCompanyMine(data, getEmployeeNavigation(currentEmployeeId), currentEmployeeId));
    },
    handlers,
  });

const updateCompanyMine = (body: CompanyMineRequest, handlers: Handlers):
ApiAction<Company> => apiActionWithCallbacks({
  url: COMPANY_MINE_URL,
  method: "patch",
  data: body,
  onSuccess: (data, dispatch) => {
    dispatch(setCompanyMine(data));
  },
  handlers,
});

const updateNavigationMenuItem = ( label: string, isOpen: boolean): UpdateNavigationMenuItem => ({
  type: UPDATE_NAVIGATION_ITEM,
  payload: { label, isOpen },
});

const autosaveConfig = () => ({
  type: AUTOSAVE_CONFIG,
});

const enableDropbox = (handlers: Handlers): ApiAction => apiActionWithCallbacks({
  url: ENABLE_COMPANY_DROPBOX,
  method: "patch",
  onSuccess: (data, dispatch) => {
    dispatch(setCompanyMine(data));
  },
  handlers,
});

const redlineConfig = () => ({
  type: REDLINE_CONFIG,
});

export default {
  selectCompany,
  getCompanyMine,
  updateCompanyMine,
  updateNavigationMenuItem,
  autosaveConfig,
  enableDropbox,
  redlineConfig,
};
