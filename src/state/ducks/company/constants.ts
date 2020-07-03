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
    path: "/",
  },
  {
    label: "Document List",
    type: "LINK",
    path: "/document_revision",
  },
  {
    label: "Change Request List",
    type: "LINK",
    path: "/change_request",
  },
];
