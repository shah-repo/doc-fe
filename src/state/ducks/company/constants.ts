/* eslint-disable max-len */
import { CHANGE_REQUEST_LIST_URL, DOCUMENT_REVISION_LIST_URL, GROUP_MANAGEMENT_ROOT_URL, HOME_URL, USER_MANAGEMENT_ROOT_URL } from "../../../ui/constants/urls";
import { GroupTag } from "../auth/types";
import { NavigationItem } from "./types";

export const SELECT_COMPANY = "company/SELECT_COMPANY";
export const SET_COMPANY_MINE = "company/SET_COMPANY_MINE";

export const WHITE_LABEL_DEFAULT = {
  logo: "",
  avatar: "",
  colors: {
    defaultBackground: "",
    primaryContrastText: "",
    primary: "",
    secondary: "",
    secondaryContrastText: "",
  },
};

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Dashboard",
    type: "LINK",
    path: HOME_URL,
    icon: "navigation_icons/dashboard.svg",
  },
  {
    label: "Document List",
    type: "LINK",
    path: DOCUMENT_REVISION_LIST_URL,
    icon: "navigation_icons/document.svg",
  },
  {
    label: "Change Request List",
    type: "LINK",
    path: CHANGE_REQUEST_LIST_URL,
    icon: "navigation_icons/cr.svg",
  },
  {
    restrictedToUsersWithTags: [GroupTag.USER_MANAGEMENT],
    label: "User Management",
    type: "LINK",
    path: USER_MANAGEMENT_ROOT_URL,
    icon: "navigation_icons/user-management.svg",
  },
  {
    restrictedToUsersWithTags: [GroupTag.GROUP_MANAGEMENT],
    label: "Group Management",
    type: "LINK",
    path: GROUP_MANAGEMENT_ROOT_URL,
    icon: "navigation_icons/group-management.svg",
  },
];
