import { makeStyles } from "@material-ui/core";
import { Colors } from "../../layout/theme-next";

export default makeStyles((theme) => ({
  "@global": {
    ".k-pager-numbers-wrap .k-pager-numbers .k-link": {
      backgroundColor: Colors.white,
      borderRadius: 15,
      marginLeft: 4,
      fontSize: 14,
      fontWeight: 400,
      color: Colors.primary,
    },
    ".k-pager-wrap .k-link.k-pager-nav:not(.k-state-disabled)": {
      color: Colors.primary,
    },
    ".k-pager-wrap .k-link.k-pager-nav.k-state-disabled": {
      color: Colors.statusClosed,
    },
    ".k-grid-pager .k-link.k-state-selected": {
      backgroundColor: Colors.primaryHighlight,
      color: Colors.primary,
      fontWeight: "600",
      fontSize: 14,
      borderRadius: 15,
      borderColor: Colors.primary,
      borderWidth: 1,
    },
    ".k-pager-numbers-wrap": {
      fontSize: 14,
      color: Colors.textBlack,
    },
    ".k-grid-pager": {
      fontSize: 12,
    },
    ".k-pager-numbers .k-link": {
      color: Colors.textBlack,
    },
    ".k-grid-header .k-link .k-icon": {
      color: Colors.primary,
    },
    ".k-grid-header .k-i-sort-asc-sm:before": {
      content: "\\e017",
    },
    ".k-grid-header .k-i-sort-desc-sm:before": {
      content: "\\e019",
    },
    "td[role=\"gridcell\"]": {
      whiteSpace: "nowrap",
    },
    "td#kendo-expandable-column[role=\"gridcell\"]": {
      whiteSpace: "normal",
    },
    ".k-pager-numbers .k-link:hover": {
      color: Colors.primary,
      backgroundColor: Colors.fieldDisabled,
      borderRadius: 15,
    },
    ".k-column-title": {
      minWidth: 0,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      flexShrink: 1,
      overflow: "hidden",
      fontWeight: 600,
      fontSize: 14,
      color: Colors.textBlack,
      textTransform: "uppercase",
    },
    ".k-toolbar, .k-grid-header, .k-grouping-header, .k-grid-add-row, .k-grid-footer": {
      background: Colors.primaryBg,
      color: Colors.textBlack,
      borderStyle: "none",
    },
    ".k-grid tr.k-alt .k-grid-content-sticky, .k-grid tr.k-alt": {
      background: Colors.white,
    },
    ".k-grouping-header .k-indicator-container": {
      fontSize: 12,
      color: Colors.textBlack,
    },
    ".k-grid tbody tr:hover td.k-grid-content-sticky, .k-grid tbody tr:hover td": {
      backgroundColor: Colors.fieldDisabled,
    },
    ".k-grid .k-grid-container .k-grid-content table tbody tr td": {
      paddingTop: 0,
      paddingBottom: 0,
    },
    ".k-indicator-container": {
      display: "flex",
    },
    ".k-button, .k-button-secondary, .k-dropdown .k-dropdown-wrap, .k-dropdowntree .k-dropdown-wrap": {
      backgroundColor: Colors.white,
    },
    ".k-pager-wrap": {
      backgroundColor: Colors.primaryBg,
    },
    ".k-dropdown .k-dropdown-wrap:hover": {
      backgroundColor: Colors.fieldDisabled,
    },
    ".k-list .k-item.k-state-selected, .k-list-optionlabel.k-state-selected": {
      backgroundColor: Colors.primary,
    },
    ".k-list .k-item:hover, .k-list .k-item.k-state-hover": {
      backgroundColor: Colors.fieldDisabled,
    },
    ".k-list-optionlabel:hover, .k-list-optionlabel.k-state-hover": {
      backgroundColor: Colors.fieldDisabled,
    },
    ".k-list .k-item:hover.k-state-selected, .k-list .k-item.k-state-hover.k-state-selected": {
      backgroundColor: Colors.primary,
    },
    ".k-list-optionlabel:hover.k-state-selected, .k-list-optionlabel.k-state-hover.k-state-selected": {
      backgroundColor: Colors.primary,
    },
    ".k-popup": {
      fontSize: 14,
    },
    ".k-master-row": {
      height: 50,
    },
    ".k-grid-header .k-header": {
      paddingBottom: 0,
    },
    ".k-grid-header-wrap table, .k-grid-content .k-grid-table": {
      minWidth: "100%",
    },
    ".k-grid": {
      color: Colors.textBlack,
      borderRadius: 4,
      border: `1px solid ${Colors.tableStroke}`,
      backgroundColor: Colors.tableStroke,
    },
    ".k-grid .k-grid-table tbody tr": {
      cursor: "pointer",
      height: 40,
    },
    ".k-grid.no-row-pointer .k-grid-table tbody tr": {
      cursor: "default",
    },
    ".k-grid .k-grid-table tbody th, .k-grid .k-grid-table tbody td": {
      borderWidth: 0,
      borderBottomWidth: 1,
    },
    ".k-grid .k-grid-header table thead th": {
      borderWidth: 0,
      borderRightWidth: 1,
      borderColor: Colors.white,
      borderStyle: "solid",
      paddingLeft: 15,
      paddingRight: 15,
    },
    ".k-grouping-header .k-group-indicator": {
      borderRadius: 15,
      backgroundColor: Colors.white,
      height: 30,
    },
    ".k-grouping-header .k-group-indicator .k-link": {
      fontStyle: "normal",
      fontWeight: "normal",
      lineHeight: 20,
    },
    ".k-grouping-header .k-group-indicator .k-link .k-icon": {
      marginRight: 10,
      marginLeft: 6,
      color: Colors.textGray,
      fontWeight: 900,
    },
    ".k-grouping-header .k-group-indicator .k-flat": {
      marginLeft: 10,
      marginRight: 6,
    },
    ".k-grid-header th.k-grid-header-sticky, .k-grid-header .k-header.k-grid-header-sticky": {
      backgroundColor: Colors.primaryBg,
    },
    ".k-master-row .k-grid-content-sticky": {
      borderColor: "rgba(0, 0, 0, 0.08)",
    },
    ".k-grid-header .k-grid-filter:hover, .k-grid-header th.k-grid-header-sticky": {
      backgroundColor: Colors.primaryBg,
    },
    ".k-grid-header td.k-grid-header-sticky, .k-grid-header .k-grid-header-sticky.k-sorted": {
      backgroundColor: Colors.primaryBg,
    },
    ".k-checkbox:checked, .k-checkbox.k-checked": {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    ".k-textbox::selection, .k-textbox .k-input::selection": {
      backgroundColor: Colors.primary,
    },
    ".k-toolbar.k-grid-toolbar": {
      paddingBottom: 0,
    },
    ".k-grid .k-grid-toolbar": {
      borderRadius: "4px 4px 0px 0px",
      borderColor: Colors.tableStroke,
    },
    ".k-grid .k-grid-pager": {
      borderRadius: "0px 0px 4px 4px",
      borderColor: Colors.tableStroke,
    },
    ".k-grid-header.k-grid-draggable-header": {
      marginRight: 1,
    },
    ".k-grid-header .k-grid-filter": {
      bottom: -4,
    },
    ".k-toolbar.k-grid-toolbar, .k-grouping-header.k-grouping-header-flex": {
      paddingLeft: 15,
    },
    ".k-columnmenu-item": {
      height: 38,
      alignItems: "center",
      display: "flex",
    },
    ".k-grid-columnmenu-popup": {
      border: Colors.stroke,
      borderRadius: 4,
      boxShadow: theme.shadows[2],
    },
    ".k-popup.k-child-animation-container": {
      borderRadius: 4,
    },
    ".k-columnmenu-item > .k-icon.k-grid-menu-icon": {
      color: "transparent",
      height: 16,
      width: 18,
      fontSize: 14,
      marginRight: 10,
    },
    ".k-columnmenu-item > .k-icon.k-i-lock.k-grid-menu-icon": {
      background: "url(../../assets/images/freeze.svg)",
      backgroundRepeat: "no-repeat",
    },
    ".k-columnmenu-item > .k-icon.k-i-unlock.k-grid-menu-icon": {
      background: "url(../../assets/images/unfreeze.svg)",
      backgroundRepeat: "no-repeat",
    },
    ".k-columnmenu-item > .k-icon.k-i-preview.k-grid-menu-icon": {
      background: "url(../../assets/images/hide.svg)",
      backgroundRepeat: "no-repeat",
    },
    ".k-grid-header thead tr th .k-icon.k-i-arrow-n, .k-grid-header thead tr th .k-icon.k-i-arrow-s": {
      color: Colors.textBlack,
    },
    ".k-list-container .k-popup .k-list .k-item": {
      whiteSpace: "nowrap",
    },
  },
}));
