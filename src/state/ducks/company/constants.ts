import { NavigationItem, NAVIGATION_ICON } from "./types";

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
    link: "/",
    icon: NAVIGATION_ICON.DASHBOARD,
  },
  {
    label: "Document List",
    type: "LINK",
    link: "/document_revision",
    icon: NAVIGATION_ICON.DOC_REV_LIST,
  },
  {
    label: "Change Request List",
    type: "LINK",
    link: "/change_request",
    icon: NAVIGATION_ICON.CR_LIST,
  },
];
