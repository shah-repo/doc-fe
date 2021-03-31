/* eslint-disable max-len */
import { CHANGE_REQUEST_LIST_URL, DOCUMENT_REVISION_LIST_URL, DOCUMENT_TYPE_MANAGEMENT_URL, GROUP_MANAGEMENT_ROOT_URL, HOME_URL, PAGE_DETAILS_MANAGEMENT_URL, USER_MANAGEMENT_ROOT_URL } from "../../../ui/constants/urls";
import { GroupTag } from "../auth/types";
import { NavigationItem } from "./types";

export const SELECT_COMPANY = "company/SELECT_COMPANY";
export const SET_COMPANY_MINE = "company/SET_COMPANY_MINE";
export const UPDATE_NAVIGATION_ITEM = "company/UPDATE_NAVIGATION_ITEM";
export const AUTOSAVE_CONFIG = "company/AUTOSAVE_CONFIG";
export const ENABLE_COMPANY_DROPBOX = "/company/dropbox_enable/mine";
export const REDLINE_CONFIG = "company/REDLINE_CONFIG";

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
    icon: "/navigation_icons/dashboard.svg",
  },
  {
    label: "Document Control",
    type: "MENU",
    icon: "/navigation_icons/document-menu.svg",
    isOpen: false,
    menu: [
      {
        label: "Document List",
        type: "LINK",
        icon: "/navigation_icons/document.svg",
        path: DOCUMENT_REVISION_LIST_URL,
      },
      {
        label: "Approval Requests",
        type: "LINK",
        path: CHANGE_REQUEST_LIST_URL,
        icon: "/navigation_icons/cr.svg",
      },
      {
        label: "Records",
        type: "CATEGORY",
        category: "Record",
        icon: "/navigation_icons/text-paper.svg",
      },
    ],
  },
  {
    label: "Equipment",
    type: "CATEGORY",
    category: "Equipment",
    icon: "/navigation_icons/document-menu.svg",
  },
  {
    label: "Purchase Orders",
    type: "CATEGORY",
    icon: "/navigation_icons/receipt_list.svg",
    category: "Purchase Order",
    restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
  },
  {
    label: "Supplier Management",
    type: "MENU",
    icon: "/navigation_icons/supplier-menu.svg",
    menu: [
      {
        icon: "/navigation_icons/supplier-list.svg",
        type: "CATEGORY",
        label: "Supplier List",
        category: "Supplier",
        restrictedToUsersWithTags: [
          GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES,
        ],
      },
    ],
    restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
  },
  {
    label: "Receiving",
    type: "CATEGORY",
    icon: "/navigation_icons/cart-simple-in.svg",
    category: "Receive",
    restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
  },
  {
    label: "Inspection",
    type: "CATEGORY",
    icon: "/navigation_icons/receipt_list.svg",
    category: "Lot Inspection",
    restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
  },
  {
    label: "Manufacturing",
    type: "MENU",
    icon: "/navigation_icons/tools.svg",
    isOpen: false,
    menu: [
      {
        label: "Work Orders",
        type: "CATEGORY",
        icon: "/navigation_icons/todo.svg",
        category: "Work Order",
        restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
      },
      {
        label: "Lots",
        type: "CATEGORY",
        icon: "/navigation_icons/tag-check.svg",
        category: "Lot",
        restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
      },
      {
        label: "Parts",
        type: "CATEGORY",
        icon: "/navigation_icons/tag-check.svg",
        category: "Parts",
      },
    ],
    restrictedToUsersWithTags: [GroupTag.CREATE_DOCS_OF_RESTRICTED_DOC_TYPES],
  },
  {
    label: "Group Management",
    type: "LINK",
    path: GROUP_MANAGEMENT_ROOT_URL,
    icon: "/navigation_icons/group-management.svg",
    restrictedToUsersWithTags: [GroupTag.GROUP_MANAGEMENT],
  },
  {
    label: "User Management",
    type: "LINK",
    path: USER_MANAGEMENT_ROOT_URL,
    icon: "/navigation_icons/user-management.svg",
    restrictedToUsersWithTags: [GroupTag.USER_MANAGEMENT],
  },
  {
    label: "Document Type Management",
    type: "LINK",
    path: DOCUMENT_TYPE_MANAGEMENT_URL,
    icon: "/navigation_icons/document.svg",
    restrictedToUsersWithTags: [GroupTag.DOCUMENT_TYPE_MANAGEMENT],
  },
  {
    label: "Page Details Management",
    type: "LINK",
    path: PAGE_DETAILS_MANAGEMENT_URL,
    icon: "/navigation_icons/receipt_list.svg",
    restrictedToUsersWithTags: [GroupTag.PAGE_DETAILS_MANAGEMENT],
  },
];
