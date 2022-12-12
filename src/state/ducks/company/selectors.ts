import { chain, filter, find, pick } from "lodash";
import { createSelector } from "reselect";
import { sortStringsByKey } from "../../../common/utils/helpers";
import Config from "../../../config";
import { ThemeEnv } from "../../../ui/layout/theme/utils/types";
import { ApplicationState } from "../../reducers";
import { WHITE_LABEL_DEFAULT } from "./constants";

const getSelectedCompany = (state: ApplicationState) => state.company.selectedCompany;
const companyIdSelector = (state: ApplicationState) => state.company.companyMine.id;
const companyNameSelector = (state: ApplicationState) => state.company.companyMine.name;
const slackTeamId = (state: ApplicationState) => state.company.selectedCompany.teamId;
const isSlackIntegrationEnabled = (state: ApplicationState) => state.company.selectedCompany.slackIntegrationEnabled;
const isHelloSignIntegrationEnabled = (state: ApplicationState) =>
  state.company.companyMine.helloSignIntegrationEnabled;

const getWhiteLabeling = createSelector(
  getSelectedCompany,
  (selectedCompany) => (selectedCompany.whiteLabeling || {})[Config.Theme as ThemeEnv] || WHITE_LABEL_DEFAULT,
);

const getAllWhiteLabeling = createSelector(
  getSelectedCompany,
  (selectedCompany) => selectedCompany.whiteLabeling || WHITE_LABEL_DEFAULT,
);

const getCompanyMine = (state: ApplicationState) => state.company.companyMine;

const getNavigationItems = (state: ApplicationState) => state.company.selectedCompany.navigation;
const getNavigationItemStatus = (state: ApplicationState, label: string) =>
  state.company.companyMine.navigation.find((item) => item.label === label);

const getCompanyMaxRevisionStage = (state: ApplicationState) => state.company.companyMine.numOfRevStages;
const getAutosaveEnabled = (state: ApplicationState) => state.company.autosaveConfig.autosaveEnabled;
const getRedlineActive = (state: ApplicationState) => state.company.redlineConfig.redlineActive;

const getNavigationTitle = (state: ApplicationState, category: string) => {
  const mainMenuItems = filter(state.company.companyMine.navigation, { type: "CATEGORY" });
  const subMenuItems = chain(state.company.companyMine.navigation)
    .filter({ type: "MENU" })
    .map("menu")
    .flatten()
    .value();
  const menuItem = find([...mainMenuItems, ...subMenuItems], { type: "CATEGORY", category });
  return menuItem?.label;
};

const getNavigationDetails = (state: ApplicationState, category: string) => {
  const mainMenuItems = filter(state.company.companyMine.navigation, { type: "CATEGORY" });
  const subMenuItems = chain(state.company.companyMine.navigation)
    .filter({ type: "MENU" })
    .map("menu")
    .flatten()
    .value();
  const menuItem = find([...mainMenuItems, ...subMenuItems], { type: "CATEGORY", category });
  return { label: menuItem?.label, icon: menuItem?.icon, path: menuItem?.path, type: menuItem?.type };
};

const getActiveEmployees = (state: ApplicationState) =>
  chain(state.company.companyMine.employees)
    .filter({ active: true })
    .map((employee) => pick(employee, ["id", "user.name"]))
    .value()
    .sort(sortStringsByKey("user.name"));

const getAllEmployees = (state: ApplicationState) => state.company.companyMine.employees;

export default {
  getWhiteLabeling,
  isSlackIntegrationEnabled,
  slackTeamId,
  getSelectedCompany,
  companyIdSelector,
  companyNameSelector,
  getCompanyMine,
  isHelloSignIntegrationEnabled,
  getNavigationItems,
  getNavigationItemStatus,
  getCompanyMaxRevisionStage,
  getAllWhiteLabeling,
  getAutosaveEnabled,
  getRedlineActive,
  getNavigationTitle,
  getNavigationDetails,
  getActiveEmployees,
  getAllEmployees,
};
