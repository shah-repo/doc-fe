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
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T06%3A56%3A28.914Z/dashboard.svg",
  },
  {
    label: "Document List",
    type: "LINK",
    path: DOCUMENT_REVISION_LIST_URL,
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T06%3A56%3A48.522Z/document.svg",
  },
  {
    label: "Approval Request List",
    type: "LINK",
    path: CHANGE_REQUEST_LIST_URL,
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T06%3A57%3A07.983Z/cr.svg",
  },
  {
    restrictedToUsersWithTags: [GroupTag.USER_MANAGEMENT],
    label: "User Management",
    type: "LINK",
    path: USER_MANAGEMENT_ROOT_URL,
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T12%3A27%3A04.444Z/user-management.svg",
  },
  {
    restrictedToUsersWithTags: [GroupTag.GROUP_MANAGEMENT],
    label: "Group Management",
    type: "LINK",
    path: GROUP_MANAGEMENT_ROOT_URL,
    icon: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/d0611cef-ba7a-4080-9ccd-70a324357d50/2020-07-08T12%3A26%3A25.758Z/group-management.svg",
  },
];
