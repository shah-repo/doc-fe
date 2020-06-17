import { ListItemIcon } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import _ from "lodash";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as ChangeRequestListIcon } from "../../assets/images/change_request_list_icon.svg";
import { ReactComponent as DashboardIcon } from "../../assets/images/dashboard_icon.svg";
import { ReactComponent as DocumentListICon } from "../../assets/images/document_list_icon.svg";
import { ReactComponent as GroupManagementIcon } from "../../assets/images/group_management_icon.svg";
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

const iconMapping: IconObject = {
  "/": <DashboardIcon />,
  [DOCUMENT_REVISION_LIST_URL]: <DocumentListICon />,
  [CHANGE_REQUEST_LIST_URL]: <ChangeRequestListIcon />,
  [USER_MANAGEMENT_ROOT_URL]: <UserManagementIcon />,
  [GROUP_MANAGEMENT_ROOT_URL]: <GroupManagementIcon />,
};

const NavigationLinkPresenter: React.FunctionComponent<NavigationLinkPresenterProps> = ({
  classes,
  url,
  text,
  ActionIcon,
  isChild,
}) => (
  <>
    <ListItem
      component={NavLink}
      button
      exact
      className={classNames(classes.link, { [classes.childLink]: isChild })}
      activeClassName={classes.activeLink}
      to={url}
    >
      <ListItemIcon className={classes.itemIcon}>
        {_.get(iconMapping, url) || <div />}
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
);

export default withStyles(styles)(NavigationLinkPresenter);
