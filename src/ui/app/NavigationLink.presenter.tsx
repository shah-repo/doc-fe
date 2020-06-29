import { ListItemIcon } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as ChangeRequestListIcon } from "../../assets/images/change_request_list_icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/images/dashboard_icon.svg";
import { ReactComponent as DocumentListICon } from "../../assets/images/document_list_icon.svg";
import { ReactComponent as GroupManagementIcon } from "../../assets/images/group_management_icon.svg";
import { ReactComponent as PurchaseOrderIcon } from "../../assets/images/purchase_order_icon.svg";
import { ReactComponent as ReceivableIcon } from "../../assets/images/receivable_icon.svg";
import { ReactComponent as SuppliersIcon } from "../../assets/images/suppliers_icon.svg";
import { ReactComponent as UserManagementIcon } from "../../assets/images/user_management_icon.svg";
import { NavigationItem } from "../../state/ducks/company";
import Text from "../components/Text";
import styles from "./NavigationLink.styles";

interface NavigationLinkPresenterProps extends
  NavigationItem,
  WithStyles<typeof styles> {
  ActionIcon?: ReactNode;
  isChild?: boolean;
  toggleChildren?: (event: React.MouseEvent) => void;
}

const iconMapping = {
  "dashboard": <DashboardIcon />,
  "document revision list": <DocumentListICon />,
  "change request list": <ChangeRequestListIcon />,
  "user management": <UserManagementIcon />,
  "group management": <GroupManagementIcon />,
  "purchase order": <PurchaseOrderIcon />,
  "receivable": <SuppliersIcon/>,
  "suppliers": <ReceivableIcon/>,
};

const NavigationLinkPresenter: React.FunctionComponent<NavigationLinkPresenterProps> = ({
  classes,
  link,
  label,
  type,
  icon,
  ActionIcon,
  isChild,
  toggleChildren,
}) => (
  <>
    <ListItem
      component={link ? NavLink : null}
      button
      exact
      className={
        classNames(classes.link, {
          [classes.childLink]: isChild,
          [classes.menu]: type === "MENU",
        })}
      activeClassName={classes.activeLink}
      to={link}
    >
      {
        type === "LINK" &&
        <ListItemIcon className={classes.itemIcon} onClick={toggleChildren}>
          {(icon && iconMapping[icon]) || <div />}
        </ListItemIcon>
      }
      <ListItemText
        primary={<Text message={label} />}
        classes={{
          primary: classes.itemText,
        }}
        onClick={toggleChildren}
      />
      {ActionIcon}
    </ListItem>
  </>
);

export default withStyles(styles)(NavigationLinkPresenter);
