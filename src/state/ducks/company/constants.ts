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
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T06%3A56%3A28.914Z/dashboard.svg",
  },
  {
    label: "Document List",
    type: "LINK",
    path: "/document_revision",
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T06%3A56%3A48.522Z/document.svg",
  },
  {
    label: "Change Request List",
    type: "LINK",
    path: "/change_request",
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T06%3A57%3A07.983Z/cr.svg",
  },
];
