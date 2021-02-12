import { indexOf } from "lodash";
import { NavigationMenu, NavigationMenuItem } from "../../state/ducks/company";

let navigationMenu: NavigationMenu[];

const getNavigation = () => {
  const data = localStorage.getItem("navigationMenu");
  if (data) {
    return JSON.parse(data);
  }
};

export const getEmployeeNavigation = (id: string) => {
  const data = localStorage.getItem("navigationMenu");
  if (data) {
    const navigation = JSON.parse(data);
    return navigation.find((item) => item.id === id);
  }
};

export const setNavigation = (id: string, data: any) => {
  navigationMenu = getNavigation() || [];

  const currentEmployeeNavigation = getEmployeeNavigation(id);
  if (currentEmployeeNavigation) {
    const index = indexOf(navigationMenu, currentEmployeeNavigation);
    navigationMenu.splice(index, 1, data);
    localStorage.setItem("navigationMenu", JSON.stringify(navigationMenu));
    return;
  }
  navigationMenu.push(data);
  localStorage.setItem("navigationMenu", JSON.stringify(navigationMenu));
};

export const updateNavigationItem = ( id: string, data: NavigationMenuItem) => {
  navigationMenu = getEmployeeNavigation(id);

  if (navigationMenu) {
    const menus = getEmployeeNavigation(id).menus.filter((item) => item.label !== data.label);
    menus.push(data);
    setNavigation(id, { id, menus });
  }
};
