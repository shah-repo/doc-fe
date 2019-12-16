import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as ChangeRequestListIcon } from "../../assets/images/change_request_list_icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/images/dashboard_icon.svg";
import { ReactComponent as DocumentListICon } from "../../assets/images/document_list_icon.svg";
import { ReactComponent as UserManagementIcon } from "../../assets/images/user_management_icon.svg";
import Text from "../components/Text";
import { LinkDefinition } from "./NavigationLink.container";

import { ListItemIcon } from "@material-ui/core";
import { CHANGE_REQUEST_LIST_URL, DOCUMENT_REVISION_LIST_URL, USER_MANAGEMENT_ROOT_URL } from "../constants/urls";
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

const iconMapping: IconObject = {
  "/": <DashboardIcon />,
  [DOCUMENT_REVISION_LIST_URL]: <DocumentListICon />,
  [CHANGE_REQUEST_LIST_URL]: <ChangeRequestListIcon />,
  [USER_MANAGEMENT_ROOT_URL]: <UserManagementIcon />,
};

const NavigationLinkPresenter: React.FunctionComponent<
  NavigationLinkPresenterProps
> = ({ classes, url, text, ActionIcon, isChild }) => (
  <NavLink
    to={url}
    exact={true}
    className={classNames(classes.link, { [classes.childLink]: isChild })}
    activeClassName={classes.activeLink}
  >
    <ListItem button={true} className={classes.itemButton}>
      <ListItemIcon className={classes.itemIcon}>
        {iconMapping[url]}
      </ListItemIcon>
      <ListItemText
        primary={<Text translation={text} />}
        classes={{
          primary: classes.itemText,
        }}
      />
    </ListItem>
    {ActionIcon}
  </NavLink>
);

export default withStyles(styles)(NavigationLinkPresenter);
