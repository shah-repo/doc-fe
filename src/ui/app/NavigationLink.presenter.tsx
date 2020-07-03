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
import { ReactComponent as LotsIcon } from "../../assets/images/lots_icon.svg";
import { ReactComponent as PurchaseOrderIcon } from "../../assets/images/purchase_order_icon.svg";
import { ReactComponent as ReceivableIcon } from "../../assets/images/receivable_icon.svg";
import { ReactComponent as SuppliersIcon } from "../../assets/images/suppliers_icon.svg";
import { ReactComponent as UserManagementIcon } from "../../assets/images/user_management_icon.svg";
import Text from "../components/Text";
import { CHANGE_REQUEST_LIST_URL, DOCUMENT_REVISION_LIST_URL, GROUP_MANAGEMENT_ROOT_URL, USER_MANAGEMENT_ROOT_URL } from "../constants/urls";
import { LinkDefinition } from "./NavigationLink.container";
import styles from "./NavigationLink.styles";

interface NavigationLinkPresenterProps
  extends LinkDefinition,
  WithStyles<typeof styles> {
  ActionIcon?: ReactNode;
  isChild?: boolean;
}

interface IconObject {
  [key: string]: JSX.Element;
}

const iconMappingByUrl: IconObject = {
  "/": <DashboardIcon />,
  [DOCUMENT_REVISION_LIST_URL]: <DocumentListICon />,
  [CHANGE_REQUEST_LIST_URL]: <ChangeRequestListIcon />,
  [USER_MANAGEMENT_ROOT_URL]: <UserManagementIcon />,
  [GROUP_MANAGEMENT_ROOT_URL]: <GroupManagementIcon />,
};

const iconMappingByText: IconObject = {
  "Purchase Order": <PurchaseOrderIcon />,
  "Receivable": <SuppliersIcon/>,
  "Suppliers": <ReceivableIcon/>,
  "Lots": <LotsIcon/>,
};

const NavigationLinkPresenter: React.FunctionComponent<NavigationLinkPresenterProps> = ({
  classes,
  url,
  text,
  ActionIcon,
  isChild,
  ...otherProps
}) => {
  const dataCy = otherProps["data-cy"] ? { "data-cy": otherProps["data-cy"] } : {};
  return (
    <>
      <ListItem
        component={NavLink}
        button
        exact
        className={classNames(classes.link, { [classes.childLink]: isChild })}
        activeClassName={classes.activeLink}
        to={url}
        {...dataCy}
      >
        <ListItemIcon className={classes.itemIcon}>
          { iconMappingByUrl[url] || iconMappingByText[text] || <div />}
        </ListItemIcon>
        <ListItemText
          primary={<Text message={text} />}
          classes={{
            primary: classes.itemText,
          }}
        />
      </ListItem>
      {ActionIcon}
    </>
  ); };

export default withStyles(styles)(NavigationLinkPresenter);
